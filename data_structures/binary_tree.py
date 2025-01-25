class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None
        self.operators = {'+', '-', '*', '/'}

    def add(self, value):
        if not self.root:
            self.root = Node(value)
            return
        
        def _add_recursive(node, value):
            if isinstance(value, (int, float)) and isinstance(node.value, (int, float)):
                if value < node.value:
                    if node.left is None:
                        node.left = Node(value)
                    else:
                        _add_recursive(node.left, value)
                else:
                    if node.right is None:
                        node.right = Node(value)
                    else:
                        _add_recursive(node.right, value)
            else:
                # For non-numeric values (like operators), add to the first available position
                if node.left is None:
                    node.left = Node(value)
                elif node.right is None:
                    node.right = Node(value)
                else:
                    _add_recursive(node.left, value)
        
        _add_recursive(self.root, value)

    def delete(self, value):
        def _find_min(node):
            current = node
            while current.left:
                current = current.left
            return current

        def _delete_recursive(node, value):
            if node is None:
                return node, False  # Return False if value not found

            if isinstance(value, (int, float)) and isinstance(node.value, (int, float)):
                # Handle numeric values
                if value < node.value:
                    node.left, deleted = _delete_recursive(node.left, value)
                elif value > node.value:
                    node.right, deleted = _delete_recursive(node.right, value)
                else:
                    deleted = True
                    # Case 1: Leaf node
                    if node.left is None and node.right is None:
                        return None, True
                    # Case 2: One child
                    elif node.left is None:
                        return node.right, True
                    elif node.right is None:
                        return node.left, True
                    # Case 3: Two children
                    else:
                        successor = _find_min(node.right)
                        node.value = successor.value
                        node.right, _ = _delete_recursive(node.right, successor.value)
            else:
                # Handle non-numeric values (like operators)
                if str(node.value) == str(value):
                    deleted = True
                    if node.left is None and node.right is None:
                        return None, True
                    elif node.left is None:
                        return node.right, True
                    elif node.right is None:
                        return node.left, True
                    else:
                        successor = _find_min(node.right)
                        node.value = successor.value
                        node.right, _ = _delete_recursive(node.right, successor.value)
                else:
                    node.left, deleted_left = _delete_recursive(node.left, value)
                    if not deleted_left:
                        node.right, deleted = _delete_recursive(node.right, value)
                    else:
                        deleted = True

            return node, deleted

        self.root, was_deleted = _delete_recursive(self.root, value)
        return was_deleted  # Return True if node was found and deleted

    def search(self, value):
        def _search_recursive(node, value):
            if node is None:
                return None
            
            if isinstance(value, (int, float)) and isinstance(node.value, (int, float)):
                if value == node.value:
                    return node
                elif value < node.value:
                    return _search_recursive(node.left, value)
                else:
                    return _search_recursive(node.right, value)
            else:
                # For non-numeric values, search both subtrees
                if str(node.value) == str(value):
                    return node
                left_result = _search_recursive(node.left, value)
                if left_result:
                    return left_result
                return _search_recursive(node.right, value)
        
        return _search_recursive(self.root, value)

    def inorder_traversal(self, start, traversal):
        if start:
            traversal = self.inorder_traversal(start.left, traversal)
            traversal += (str(start.value) + '-')
            traversal = self.inorder_traversal(start.right, traversal)
        return traversal

    def infix_to_postfix(self, expression):
        """Convert infix expression to postfix notation"""
        def precedence(op):
            if op in {'+', '-'}:
                return 1
            if op in {'*', '/'}:
                return 2
            return 0

        tokens = []
        current_num = ''
        
        # Tokenize the expression
        for char in expression:
            if char.isdigit():
                current_num += char
            else:
                if current_num:
                    tokens.append(current_num)
                    current_num = ''
                if char not in {' ', '(', ')'}:
                    tokens.append(char)
                elif char in {'(', ')'}:
                    tokens.append(char)
        if current_num:
            tokens.append(current_num)

        stack = []
        postfix = []
        
        for token in tokens:
            if token.isdigit():
                postfix.append(token)
            elif token == '(':
                stack.append(token)
            elif token == ')':
                while stack and stack[-1] != '(':
                    postfix.append(stack.pop())
                if stack:
                    stack.pop()  # Remove '('
            else:
                while (stack and stack[-1] != '(' and 
                       precedence(stack[-1]) >= precedence(token)):
                    postfix.append(stack.pop())
                stack.append(token)
        
        while stack:
            postfix.append(stack.pop())
            
        return postfix

    def create_expression_tree(self, expression):
        """
        Create an arithmetic expression tree from an infix expression
        Args:
            expression: String representing the infix expression
            Example: "(4+5)*(7-3)" will be converted to postfix and then to tree
        """
        postfix = self.infix_to_postfix(expression)
        stack = []
        
        for token in postfix:
            node = Node(token)
            if token in self.operators:
                # Operator node: pop two operands and attach them
                node.right = stack.pop()
                node.left = stack.pop()
            stack.append(node)
            
        self.root = stack[0] if stack else None
        return self.root

    def evaluate_expression(self, node):
        """
        Evaluate the arithmetic expression tree
        Args:
            node: Root node of the expression tree
        Returns:
            float: Result of the expression
        """
        if node is None:
            return 0
        
        # Leaf node (operand)
        if node.left is None and node.right is None:
            return float(node.value)
        
        # Evaluate left and right subtrees
        left_val = self.evaluate_expression(node.left)
        right_val = self.evaluate_expression(node.right)
        
        # Apply operator
        if node.value == '+':
            return left_val + right_val
        elif node.value == '-':
            return left_val - right_val
        elif node.value == '*':
            return left_val * right_val
        elif node.value == '/':
            return left_val / right_val if right_val != 0 else float('inf')