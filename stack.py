class Node:
    def __init__(self, data):
        self.data = data
        self.next = None


class LinkedListStack:
    def __init__(self):
        self.top = None

    def is_empty(self):
        return self.top is None

    def push(self, data):
        new_node = Node(data)
        new_node.next = self.top
        self.top = new_node

    def pop(self):
        if self.is_empty():
            raise Exception("Stack underflow")
        popped_data = self.top.data
        self.top = self.top.next
        return popped_data

    def peek(self):
        if self.is_empty():
            return None
        return self.top.data

    def as_list(self):
        elements = []
        current = self.top
        while current:
            elements.append(current.data)
            current = current.next
        return elements


def is_operator(c):
    return c in "+-*/^"


def precedence(op):
    if op in "+-":
        return 1
    elif op in "*/":
        return 2
    elif op == "^":
        return 3
    return 0


def shunting_yard_step_by_step(infix_expression):
    stack = LinkedListStack()
    output = []
    steps = []

    for char in infix_expression:
        if char.isalnum():  # Operand
            output.append(char)
            steps.append(''.join(output))  # Record step
        elif is_operator(char):  # Operator
            while (not stack.is_empty() and precedence(stack.peek()) >= precedence(char)):
                output.append(stack.pop())
                steps.append(''.join(output))  # Record step
            stack.push(char)
        elif char == '(':
            stack.push(char)
        elif char == ')':
            while not stack.is_empty() and stack.peek() != '(':
                output.append(stack.pop())
                steps.append(''.join(output))  # Record step
            stack.pop()  # Pop the '('

    while not stack.is_empty():  # Pop remaining operators
        output.append(stack.pop())
        steps.append(''.join(output))  # Record step

    return steps
