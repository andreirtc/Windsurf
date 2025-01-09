from flask import Flask, render_template, jsonify, request, flash, redirect, url_for, g
from flask_login import LoginManager, login_user, login_required, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Comment
from stack import LinkedListStack, shunting_yard_step_by_step
from queue_lab import Queue, Deque
from linked_list import LinkedList
from binary_tree import BinaryTree
from graph import Graph

app = Flask(__name__)
app.config['SECRET_KEY'] = 'windsurf_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///windsurf.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Create a global binary tree instance
binary_tree = BinaryTree()

# Create a global graph instance
metro_graph = Graph()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/works')
def works():
    return render_template('works.html')

@app.route('/works/stack')
def stack():
    return render_template('stack.html')

@app.route('/works/queue')
def queue():
    return render_template('queue.html')

@app.route('/works/deque')
def deque():
    return render_template('deque.html')

@app.route('/works/linked-list')
def linked_list():
    return render_template('linked_list.html')

@app.route('/works/binary-tree')
def binary_tree_page():
    return render_template('binary_tree.html')

@app.route('/works/graph')
def graph_page():
    return render_template('graph.html')

@app.route('/profile')
def profile():
    return render_template('profile.html')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        new_comment = Comment(name=name, email=email, subject=subject, message=message)
        db.session.add(new_comment)
        db.session.commit()
        
        flash('Thank you for your message!', 'success')
        return redirect(url_for('contact'))
    return render_template('contact.html')

@app.route('/admin', methods=['GET', 'POST'])
@login_required
def admin():
    comments = Comment.query.order_by(Comment.created_at.desc()).all()
    return render_template('admin.html', comments=comments)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for('admin'))
        flash('Invalid credentials', 'error')
    return render_template('login.html')

# API endpoints for data structures
@app.route('/api/shunting-yard', methods=['POST'])
def process_shunting_yard():
    data = request.get_json()
    infix_expression = data.get('expression', '')
    steps = shunting_yard_step_by_step(infix_expression)
    return jsonify({'steps': steps})

@app.route('/api/queue/enqueue', methods=['POST'])
def queue_enqueue():
    data = request.get_json()
    # Implementation here
    return jsonify({'success': True})

@app.route('/api/queue/dequeue', methods=['POST'])
def queue_dequeue():
    # Implementation here
    return jsonify({'success': True})

@app.route('/create_expression_tree', methods=['POST'])
def create_expression_tree():
    try:
        data = request.get_json()
        expression = data.get('expression')
        
        # Create a new binary tree and build the expression tree
        tree = BinaryTree()
        tree.create_expression_tree(expression)
        
        # Convert the tree to a format that can be sent to the client
        def tree_to_dict(node):
            if node is None:
                return None
            return {
                'value': node.value,
                'left': tree_to_dict(node.left),
                'right': tree_to_dict(node.right)
            }
        
        return jsonify({
            'success': True,
            'tree': tree_to_dict(tree.root)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/insert_node', methods=['POST'])
def insert_node():
    try:
        data = request.get_json()
        value = data.get('value')
        
        # Try to convert to number if possible
        try:
            value = float(value)
        except ValueError:
            pass
        
        # Use the global binary tree instance
        global binary_tree
        binary_tree.add(value)
        
        # Convert the tree to a format that can be sent to the client
        def tree_to_dict(node):
            if node is None:
                return None
            return {
                'value': node.value,
                'left': tree_to_dict(node.left),
                'right': tree_to_dict(node.right)
            }
        
        return jsonify({
            'success': True,
            'message': f'Successfully inserted node with value: {value}',
            'tree': tree_to_dict(binary_tree.root)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/delete_node', methods=['POST'])
def delete_node():
    try:
        data = request.get_json()
        value = data.get('value')
        
        # Try to convert to number if possible
        try:
            value = float(value)
        except ValueError:
            pass
        
        # Use the global binary tree instance
        global binary_tree
        
        # Delete the node and get the result
        was_deleted = binary_tree.delete(value)
        
        if was_deleted:
            # Convert the tree to a format that can be sent to the client
            def tree_to_dict(node):
                if node is None:
                    return None
                return {
                    'value': node.value,
                    'left': tree_to_dict(node.left),
                    'right': tree_to_dict(node.right)
                }
            
            return jsonify({
                'success': True,
                'message': f'Successfully deleted node with value: {value}',
                'tree': tree_to_dict(binary_tree.root)
            })
        else:
            return jsonify({
                'success': False,
                'error': f'Node with value {value} not found in the tree'
            })
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/clear_tree', methods=['POST'])
def clear_tree():
    try:
        global binary_tree
        binary_tree = BinaryTree()  # Create a new empty tree
        
        return jsonify({
            'success': True,
            'message': 'Tree cleared successfully'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/get_stations', methods=['GET'])
def get_stations():
    stations = metro_graph.get_all_stations()
    lines = metro_graph.get_lines()
    return jsonify({
        'stations': stations,
        'lines': lines
    })

@app.route('/find_path', methods=['POST'])
def find_path():
    data = request.get_json()
    start = data.get('start')
    end = data.get('end')
    
    if not start or not end:
        return jsonify({'error': 'Start and end stations are required'}), 400
        
    path, total_time = metro_graph.get_shortest_path(start, end)
    
    if not path:
        return jsonify({'error': 'No path found'}), 404
        
    # Get the line information for each station in the path
    path_with_lines = []
    for station in path:
        line = metro_graph.get_station_line(station)
        path_with_lines.append({
            'station': station,
            'line': line
        })
        
    return jsonify({
        'path': path_with_lines,
        'total_time': total_time
    })

@app.route('/clear-messages', methods=['POST'])
@login_required
def clear_messages():
    try:
        # Delete all comments
        Comment.query.delete()
        db.session.commit()
        flash('All messages have been cleared successfully.', 'success')
    except Exception as e:
        db.session.rollback()
        flash('An error occurred while clearing messages.', 'error')
    
    return redirect(url_for('admin'))

# Similar endpoints for other data structures...

with app.app_context():
    db.create_all()
    # Create admin user if not exists
    if not User.query.filter_by(username='admin').first():
        admin_user = User(
            username='admin',
            password=generate_password_hash('windsurf2024')
        )
        db.session.add(admin_user)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, port=5001)
