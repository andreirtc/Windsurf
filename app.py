import os
import random
import secrets

from dotenv import load_dotenv
from flask import Flask, flash, jsonify, redirect, render_template, request, url_for
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from werkzeug.security import check_password_hash, generate_password_hash

from algorithms.sorting import BubbleSort, InsertionSort, MergeSort, QuickSort, SelectionSort
from data_structures import BinaryTree, Deque, Graph, LinkedList, Queue, Stack
from data_structures.stack import shunting_yard_step_by_step
from models import Comment, User, db

# Loads local values from .env when present. Railway provides the same values
# through its Variables tab, so no .env file should be committed.
load_dotenv()

app = Flask(__name__)

database_url = os.environ.get("DATABASE_URL", "sqlite:///windsurf.db")

# Some platforms still provide the legacy postgres:// scheme. SQLAlchemy expects
# postgresql://, so normalize it before configuring the engine.
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

secret_key = os.environ.get("SECRET_KEY")
if not secret_key:
    # Safe for local development only. Set SECRET_KEY in Railway so sessions stay
    # valid across restarts and deployments.
    secret_key = secrets.token_urlsafe(48)
    app.logger.warning(
        "SECRET_KEY is not set. A temporary local-development key was generated."
    )

app.config.update(
    SECRET_KEY=secret_key,
    SQLALCHEMY_DATABASE_URI=database_url,
    SQLALCHEMY_TRACK_MODIFICATIONS=False,
    SQLALCHEMY_ENGINE_OPTIONS={"pool_pre_ping": True},
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=bool(os.environ.get("RAILWAY_ENVIRONMENT")),
)

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"

# These interactive structures are intentionally in memory for this educational
# application. They reset when the service restarts.
binary_tree = BinaryTree()
metro_graph = Graph()


@login_manager.user_loader
def load_user(user_id):
    try:
        return db.session.get(User, int(user_id))
    except (TypeError, ValueError):
        return None


def get_json_body():
    """Return a JSON request body as a dictionary, even for an empty body."""
    return request.get_json(silent=True) or {}


def serialize_tree(node):
    """Convert a BinaryTree node into JSON-serializable data."""
    if node is None:
        return None

    return {
        "value": node.value,
        "left": serialize_tree(node.left),
        "right": serialize_tree(node.right),
    }


def initialize_database():
    """Create tables and optionally create the first admin from environment variables."""
    db.create_all()

    admin_username = (os.environ.get("ADMIN_USERNAME") or "").strip()
    admin_password = os.environ.get("ADMIN_PASSWORD") or ""

    # No default credentials are stored in source code. For Railway, set both
    # variables in the service's Variables tab before the first deployment.
    if not admin_username or not admin_password:
        app.logger.warning(
            "Admin account was not created because ADMIN_USERNAME and/or "
            "ADMIN_PASSWORD is not configured."
        )
        return

    existing_user = User.query.filter_by(username=admin_username).first()
    if existing_user is None:
        admin_user = User(
            username=admin_username,
            password=generate_password_hash(admin_password),
        )
        db.session.add(admin_user)
        db.session.commit()
        app.logger.info("Initial admin account created from environment variables.")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/works")
def works():
    return render_template("works.html")


@app.route("/data-structure/stack")
def stack():
    return render_template("data_structures/stack.html")


@app.route("/data-structure/queue")
def queue():
    return render_template("data_structures/queue.html")


@app.route("/data-structure/deque")
def deque():
    return render_template("data_structures/deque.html")


@app.route("/data-structure/linked-list")
def linked_list():
    return render_template("data_structures/linked_list.html")


@app.route("/data-structure/binary-tree")
def binary_tree_page():
    return render_template("data_structures/binary_tree.html")


@app.route("/data-structure/graph")
def graph_page():
    return render_template("data_structures/graph.html")


@app.route("/profile")
def profile():
    return render_template("profile.html")


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        email = (request.form.get("email") or "").strip()
        subject = (request.form.get("subject") or "").strip()
        message = (request.form.get("message") or "").strip()

        if not all([name, email, subject, message]):
            flash("Please complete all contact-form fields.", "error")
            return redirect(url_for("contact"))

        new_comment = Comment(
            name=name,
            email=email,
            subject=subject,
            message=message,
        )
        db.session.add(new_comment)
        db.session.commit()

        flash("Thank you for your message!", "success")
        return redirect(url_for("contact"))

    return render_template("contact.html")


@app.route("/admin", methods=["GET", "POST"])
@login_required
def admin():
    comments = Comment.query.order_by(Comment.created_at.desc()).all()
    return render_template("admin.html", comments=comments)


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = (request.form.get("username") or "").strip()
        password = request.form.get("password") or ""
        user = User.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for("admin"))

        flash("Invalid credentials", "error")

    return render_template("login.html")


@app.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("home"))


# API endpoints for data structures

@app.route("/api/shunting-yard", methods=["POST"])
def process_shunting_yard():
    data = get_json_body()
    infix_expression = data.get("expression", "")
    steps = shunting_yard_step_by_step(infix_expression)
    return jsonify({"steps": steps})


@app.route("/api/queue/enqueue", methods=["POST"])
def queue_enqueue():
    # The page currently manages its queue visualization client-side.
    return jsonify({"success": True})


@app.route("/api/queue/dequeue", methods=["POST"])
def queue_dequeue():
    # The page currently manages its queue visualization client-side.
    return jsonify({"success": True})


@app.route("/create_expression_tree", methods=["POST"])
def create_expression_tree():
    try:
        data = get_json_body()
        expression = data.get("expression")

        if not expression:
            return jsonify({"success": False, "error": "An expression is required."}), 400

        tree = BinaryTree()
        tree.create_expression_tree(expression)

        return jsonify({"success": True, "tree": serialize_tree(tree.root)})
    except Exception as error:
        return jsonify({"success": False, "error": str(error)}), 400


@app.route("/insert_node", methods=["POST"])
def insert_node():
    try:
        data = get_json_body()
        value = data.get("value")

        if value is None or str(value).strip() == "":
            return jsonify({"success": False, "error": "A node value is required."}), 400

        try:
            value = float(value)
        except (TypeError, ValueError):
            pass

        global binary_tree
        binary_tree.add(value)

        return jsonify(
            {
                "success": True,
                "message": f"Successfully inserted node with value: {value}",
                "tree": serialize_tree(binary_tree.root),
            }
        )
    except Exception as error:
        return jsonify({"success": False, "error": str(error)}), 400


@app.route("/delete_node", methods=["POST"])
def delete_node():
    try:
        data = get_json_body()
        value = data.get("value")

        if value is None or str(value).strip() == "":
            return jsonify({"success": False, "error": "A node value is required."}), 400

        try:
            value = float(value)
        except (TypeError, ValueError):
            pass

        global binary_tree
        was_deleted = binary_tree.delete(value)

        if not was_deleted:
            return jsonify(
                {
                    "success": False,
                    "error": f"Node with value {value} was not found in the tree.",
                }
            ), 404

        return jsonify(
            {
                "success": True,
                "message": f"Successfully deleted node with value: {value}",
                "tree": serialize_tree(binary_tree.root),
            }
        )
    except Exception as error:
        return jsonify({"success": False, "error": str(error)}), 400


@app.route("/clear_tree", methods=["POST"])
def clear_tree():
    global binary_tree
    binary_tree = BinaryTree()
    return jsonify({"success": True, "message": "Tree cleared successfully"})


@app.route("/get_stations", methods=["GET"])
def get_stations():
    return jsonify(
        {
            "stations": metro_graph.get_all_stations(),
            "lines": metro_graph.get_lines(),
        }
    )


@app.route("/find_path", methods=["POST"])
def find_path():
    data = get_json_body()
    start = data.get("start")
    end = data.get("end")

    if not start or not end:
        return jsonify({"error": "Start and end stations are required"}), 400

    path, total_time = metro_graph.get_shortest_path(start, end)

    if not path:
        return jsonify({"error": "No path found"}), 404

    path_with_lines = [
        {"station": station, "line": metro_graph.get_station_line(station)}
        for station in path
    ]

    return jsonify({"path": path_with_lines, "total_time": total_time})


@app.route("/clear-messages", methods=["POST"])
@login_required
def clear_messages():
    try:
        Comment.query.delete()
        db.session.commit()
        flash("All messages have been cleared successfully.", "success")
    except Exception:
        db.session.rollback()
        flash("An error occurred while clearing messages.", "error")

    return redirect(url_for("admin"))


@app.route("/data_structures")
def data_structures():
    return render_template("data_structures.html")


@app.route("/algorithms")
def algorithms():
    return render_template("algorithms.html")


# Sorting algorithm routes

@app.route("/bubble_sort")
def bubble_sort():
    return render_template("sorting/bubble_sort.html")


@app.route("/selection_sort")
def selection_sort():
    return render_template("sorting/selection_sort.html")


@app.route("/insertion_sort")
def insertion_sort():
    return render_template("sorting/insertion_sort.html")


@app.route("/merge_sort")
def merge_sort():
    return render_template("sorting/merge_sort.html")


@app.route("/quick_sort")
def quick_sort():
    return render_template("sorting/quick_sort.html")


@app.route("/api/sort/<algorithm>", methods=["POST"])
def sort_array(algorithm):
    data = get_json_body()
    array = data.get("array", [])

    if not array:
        return jsonify({"error": "No array provided"}), 400

    sorters = {
        "bubble": BubbleSort,
        "selection": SelectionSort,
        "insertion": InsertionSort,
        "merge": MergeSort,
        "quick": QuickSort,
    }

    sorter_class = sorters.get(algorithm)
    if sorter_class is None:
        return jsonify({"error": "Invalid algorithm"}), 400

    sorter = sorter_class()
    sorter.set_array(array)
    steps = sorter.sort()

    return jsonify({"steps": steps, "final_array": sorter.array})


@app.route("/api/generate_array", methods=["POST"])
def generate_array():
    data = get_json_body()
    size = data.get("size", 50)
    array_type = data.get("type", "random")

    try:
        size = int(size)
    except (TypeError, ValueError):
        return jsonify({"error": "Array size must be a whole number."}), 400

    if size < 5 or size > 100:
        return jsonify({"error": "Array size must be between 5 and 100"}), 400

    if array_type == "random":
        array = [random.randint(10, 300) for _ in range(size)]
    elif array_type == "sorted":
        array = [i * (300 / size) + 10 for i in range(size)]
    elif array_type == "nearly_sorted":
        array = [i * (300 / size) + 10 for i in range(size)]
        for _ in range(int(size * 0.1)):
            first_index, second_index = random.sample(range(size), 2)
            array[first_index], array[second_index] = (
                array[second_index],
                array[first_index],
            )
    elif array_type == "duplicates":
        possible_values = [25, 50, 75, 100, 125, 150, 175, 200]
        array = [random.choice(possible_values) for _ in range(size)]
    else:
        return jsonify({"error": "Invalid array type"}), 400

    return jsonify({"array": array})


with app.app_context():
    initialize_database()


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5001)),
        debug=os.environ.get("FLASK_DEBUG") == "1",
    )
