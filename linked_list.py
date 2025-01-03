class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
        self.tail = None
        self._size = 0

    def size(self):
        return self._size

    def insert_at_beginning(self, data):
        new_node = Node(data)
        self._size += 1
        if self.head:
            new_node.next = self.head
            self.head = new_node
        else:
            self.head = self.tail = new_node

    def insert_at_end(self, data):
        new_node = Node(data)
        self._size += 1
        if self.tail:
            self.tail.next = new_node
            self.tail = new_node
        else:
            self.head = self.tail = new_node

    def remove_beginning(self):
        if not self.head:
            return None
        removed_data = self.head.data
        self.head = self.head.next
        self._size -= 1
        if not self.head:
            self.tail = None
        return removed_data

    def remove_at_end(self):
        if not self.head:
            return None
        self._size -= 1
        if self.head == self.tail:
            removed_data = self.head.data
            self.head = self.tail = None
            return removed_data
        current = self.head
        while current.next != self.tail:
            current = current.next
        removed_data = self.tail.data
        self.tail = current
        self.tail.next = None
        return removed_data

    def search(self, data):
        current = self.head
        while current:
            if current.data == data:
                return True
            current = current.next
        return False

    def to_list(self):
        result = []
        current = self.head
        while current:
            result.append(current.data)
            current = current.next
        return result

    def remove_at(self, data):
        """
        Remove a node with the specified data and return the removed data.
        Returns None if the data is not found.
        """
        if not self.head:
            return None
            
        # If head contains the data to be removed
        if self.head.data == data:
            return self.remove_beginning()
            
        # Search for the node to remove
        current = self.head
        while current.next:
            if current.next.data == data:
                removed_data = current.next.data
                # If removing the tail node, update tail
                if current.next == self.tail:
                    self.tail = current
                    current.next = None
                else:
                    current.next = current.next.next
                self._size -= 1
                return removed_data
            current = current.next
            
        return None
