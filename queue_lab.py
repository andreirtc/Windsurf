class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
        self.prev = None


class Queue:
    def __init__(self):
        self.front = None
        self.rear = None
        self._size = 0

    def is_empty(self):
        return self.front is None

    def enqueue(self, data):
        new_node = Node(data)
        self._size += 1
        if self.rear is None:
            self.front = self.rear = new_node
        else:
            self.rear.next = new_node
            self.rear = new_node

    def dequeue(self):
        if self.is_empty():
            return "The queue is empty"
        removed_data = self.front.data
        self.front = self.front.next
        self._size -= 1
        if self.front is None:  
            self.rear = None
        return removed_data

    def peek(self):
        if self.is_empty():
            return "The queue is empty"
        return self.front.data

    def size(self):
        return self._size

    def to_list(self):
        result = []
        current = self.front
        while current:
            result.append(current.data)
            current = current.next
        return result


class Deque:
    def __init__(self):
        self.front = None
        self.rear = None
        self._size = 0

    def is_empty(self):
        return self.front is None

    def size(self):
        return self._size

    def add_front(self, data):
        new_node = Node(data)
        self._size += 1
        if self.is_empty():
            self.front = self.rear = new_node
        else:
            new_node.next = self.front
            self.front.prev = new_node
            self.front = new_node

    def add_rear(self, data):
        new_node = Node(data)
        self._size += 1
        if self.is_empty():
            self.front = self.rear = new_node
        else:
            self.rear.next = new_node
            new_node.prev = self.rear
            self.rear = new_node

    def remove_front(self):
        if self.is_empty():
            return "The deque is empty"
        removed_data = self.front.data
        self.front = self.front.next
        self._size -= 1
        if self.front:
            self.front.prev = None
        else:
            self.rear = None
        return removed_data

    def remove_rear(self):
        if self.is_empty():
            return "The deque is empty"
        removed_data = self.rear.data
        self._size -= 1
        if self.front == self.rear:
            self.front = self.rear = None
        else:
            self.rear = self.rear.prev
            self.rear.next = None
        return removed_data

    def peek_front(self):
        if self.is_empty():
            return "The deque is empty"
        return self.front.data

    def peek_rear(self):
        if self.is_empty():
            return "The deque is empty"
        return self.rear.data

    def to_list(self):
        result = []
        current = self.front
        while current:
            result.append(current.data)
            current = current.next
        return result
