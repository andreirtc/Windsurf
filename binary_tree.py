class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinaryTree:
    def __init__(self):
        self.root = None

    def add(self, value):
        if not self.root:
            self.root = Node(value)
            return
        
        def _add_recursive(node, value):
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
        
        _add_recursive(self.root, value)

    def delete(self, value):
        def _find_min(node):
            current = node
            while current.left:
                current = current.left
            return current

        def _delete_recursive(node, value):
            if node is None:
                return node

            if value < node.value:
                node.left = _delete_recursive(node.left, value)
            elif value > node.value:
                node.right = _delete_recursive(node.right, value)
            else:
                # Node with only one child or no child
                if node.left is None:
                    return node.right
                elif node.right is None:
                    return node.left
                
                # Node with two children
                temp = _find_min(node.right)
                node.value = temp.value
                node.right = _delete_recursive(node.right, temp.value)
            
            return node

        self.root = _delete_recursive(self.root, value)

    def search(self, value):
        result = []
        
        def _inorder_search(node, value):
            if node:
                _inorder_search(node.left, value)
                if node.value == value:
                    result.append(node)
                _inorder_search(node.right, value)
        
        _inorder_search(self.root, value)
        return result[0] if result else None

    def inorder_traversal(self, start, traversal):
        if start:
            traversal = self.inorder_traversal(start.left, traversal)
            traversal += (str(start.value) + '-')
            traversal = self.inorder_traversal(start.right, traversal)
        return traversal

    def create_expression_tree(self, expression):
        """
        Create an arithmetic expression tree from a list of tokens
        Args:
            expression: List of strings representing the expression in postfix notation
            Example: ["4", "5", "+", "7", "3", "-", "*"] for (4 + 5) * (7 - 3)
        """
        stack = []
        operators = {'+', '-', '*', '/'}
        
        for token in expression:
            node = Node(token)
            if token in operators:
                # Operator node: pop two operands and attach them
                node.right = stack.pop()
                node.left = stack.pop()
            stack.append(node)
            
        self.root = stack[0]
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