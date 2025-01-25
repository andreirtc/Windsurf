from typing import List, Dict, Any
from abc import ABC, abstractmethod

class SortingAlgorithm(ABC):
    def __init__(self):
        self.array: List[int] = []
        self.steps: List[Dict[str, Any]] = []
        
    def set_array(self, array: List[int]) -> None:
        """Set the array to be sorted."""
        self.array = array.copy()
        self.steps = []
        
    def get_steps(self) -> List[Dict[str, Any]]:
        """Get the steps of the sorting process."""
        return self.steps
    
    def add_step(self, comparing: List[int] = None, swapping: List[int] = None, 
                sorted_indices: List[int] = None, array: List[int] = None) -> None:
        """Add a step to the sorting process."""
        step = {
            'array': array if array is not None else self.array.copy(),
            'comparing': comparing if comparing is not None else [],
            'swapping': swapping if swapping is not None else [],
            'sorted': sorted_indices if sorted_indices is not None else []
        }
        self.steps.append(step)
    
    @abstractmethod
    def sort(self) -> List[Dict[str, Any]]:
        """Sort the array and return the steps."""
        pass

class BubbleSort(SortingAlgorithm):
    def sort(self) -> List[Dict[str, Any]]:
        n = len(self.array)
        sorted_indices = set()  # Using a set to track sorted indices
        
        for i in range(n-1):
            swapped = False
            
            # Always start comparing from the beginning
            for j in range(0, n-i-1):
                # Always show comparison (turns bars green)
                self.add_step(comparing=[j, j+1], sorted_indices=list(sorted_indices))
                
                if self.array[j] > self.array[j+1]:
                    # Show swap
                    self.add_step(swapping=[j, j+1], sorted_indices=list(sorted_indices))
                    
                    # Perform swap
                    self.array[j], self.array[j+1] = self.array[j+1], self.array[j]
                    swapped = True
            
            # After the pass, mark the rightmost unsorted element as sorted
            current_sorted = n-i-1
            sorted_indices.add(current_sorted)
            self.add_step(sorted_indices=list(sorted_indices))
            
            if not swapped:
                # If no swaps occurred, mark remaining elements as sorted
                for k in range(current_sorted-1, -1, -1):
                    sorted_indices.add(k)
                    self.add_step(sorted_indices=list(sorted_indices))
                break
        
        # Make sure the first element is marked as sorted if not already
        if 0 not in sorted_indices:
            sorted_indices.add(0)
            self.add_step(sorted_indices=list(sorted_indices))
        
        return self.steps

class SelectionSort(SortingAlgorithm):
    def sort(self) -> List[Dict[str, Any]]:
        n = len(self.array)
        sorted_indices = []
        
        for i in range(n):
            min_idx = i
            
            # Add step to show the current position
            self.add_step(comparing=[i], sorted_indices=sorted_indices)
            
            for j in range(i+1, n):
                # Add step to show comparison
                self.add_step(comparing=[min_idx, j], sorted_indices=sorted_indices)
                
                if self.array[j] < self.array[min_idx]:
                    min_idx = j
            
            if min_idx != i:
                # Add step to show swap
                self.add_step(swapping=[i, min_idx], sorted_indices=sorted_indices)
                
                # Perform swap
                self.array[i], self.array[min_idx] = self.array[min_idx], self.array[i]
                
                # Add step to show result of swap
                self.add_step(sorted_indices=sorted_indices)
            
            # Mark current position as sorted
            sorted_indices.append(i)
            self.add_step(sorted_indices=sorted_indices)
        
        return self.steps

class InsertionSort(SortingAlgorithm):
    def sort(self) -> List[Dict[str, Any]]:
        n = len(self.array)
        sorted_indices = [0]  # First element is initially sorted
        self.add_step(sorted_indices=sorted_indices)
        
        for i in range(1, n):
            key = self.array[i]
            j = i - 1
            
            # Add step to show the current element being inserted
            self.add_step(comparing=[i], sorted_indices=sorted_indices)
            
            while j >= 0 and self.array[j] > key:
                # Add step to show comparison
                self.add_step(comparing=[j, j+1], sorted_indices=sorted_indices)
                
                # Add step to show swap
                self.add_step(swapping=[j, j+1], sorted_indices=sorted_indices)
                
                # Perform move
                self.array[j + 1] = self.array[j]
                j -= 1
                
                # Add step to show result of move
                self.add_step(sorted_indices=sorted_indices)
            
            self.array[j + 1] = key
            
            # Mark current position as sorted
            sorted_indices.append(i)
            sorted_indices.sort()  # Keep sorted indices in order
            self.add_step(sorted_indices=sorted_indices)
        
        return self.steps

class MergeSort(SortingAlgorithm):
    def merge(self, left: int, mid: int, right: int, sorted_indices: List[int]) -> None:
        """Merge two sorted subarrays."""
        left_half = self.array[left:mid + 1]
        right_half = self.array[mid + 1:right + 1]
        
        i = j = 0
        k = left
        
        while i < len(left_half) and j < len(right_half):
            # Add step to show comparison
            self.add_step(comparing=[left + i, mid + 1 + j], sorted_indices=sorted_indices)
            
            if left_half[i] <= right_half[j]:
                self.array[k] = left_half[i]
                i += 1
            else:
                self.array[k] = right_half[j]
                j += 1
            
            # Add step to show placement
            self.add_step(swapping=[k], sorted_indices=sorted_indices)
            k += 1
        
        while i < len(left_half):
            self.array[k] = left_half[i]
            self.add_step(swapping=[k], sorted_indices=sorted_indices)
            i += 1
            k += 1
        
        while j < len(right_half):
            self.array[k] = right_half[j]
            self.add_step(swapping=[k], sorted_indices=sorted_indices)
            j += 1
            k += 1
        
        # Mark the merged section as sorted
        sorted_indices.extend(range(left, right + 1))
        sorted_indices = list(set(sorted_indices))  # Remove duplicates
        self.add_step(sorted_indices=sorted_indices)
    
    def merge_sort(self, left: int, right: int, sorted_indices: List[int]) -> None:
        """Recursive merge sort implementation."""
        if left < right:
            mid = (left + right) // 2
            
            self.merge_sort(left, mid, sorted_indices)
            self.merge_sort(mid + 1, right, sorted_indices)
            
            self.merge(left, mid, right, sorted_indices)
    
    def sort(self) -> List[Dict[str, Any]]:
        sorted_indices = []
        self.merge_sort(0, len(self.array) - 1, sorted_indices)
        return self.steps

class QuickSort(SortingAlgorithm):
    def partition(self, low: int, high: int, sorted_indices: List[int]) -> int:
        """Partition the array and return the pivot index."""
        pivot = self.array[high]
        i = low - 1
        
        # Add step to show pivot
        self.add_step(comparing=[high], sorted_indices=sorted_indices)
        
        for j in range(low, high):
            # Add step to show comparison with pivot
            self.add_step(comparing=[j, high], sorted_indices=sorted_indices)
            
            if self.array[j] <= pivot:
                i += 1
                
                if i != j:
                    # Add step to show swap
                    self.add_step(swapping=[i, j], sorted_indices=sorted_indices)
                    
                    # Perform swap
                    self.array[i], self.array[j] = self.array[j], self.array[i]
                    
                    # Add step to show result of swap
                    self.add_step(sorted_indices=sorted_indices)
        
        if i + 1 != high:
            # Add step to show final pivot swap
            self.add_step(swapping=[i + 1, high], sorted_indices=sorted_indices)
            
            # Perform swap
            self.array[i + 1], self.array[high] = self.array[high], self.array[i + 1]
            
            # Add step to show result of swap
            self.add_step(sorted_indices=sorted_indices)
        
        return i + 1
    
    def quick_sort(self, low: int, high: int, sorted_indices: List[int]) -> None:
        """Recursive quicksort implementation."""
        if low < high:
            pivot_idx = self.partition(low, high, sorted_indices)
            
            # Mark pivot as sorted
            sorted_indices.append(pivot_idx)
            self.add_step(sorted_indices=sorted_indices)
            
            self.quick_sort(low, pivot_idx - 1, sorted_indices)
            self.quick_sort(pivot_idx + 1, high, sorted_indices)
    
    def sort(self) -> List[Dict[str, Any]]:
        sorted_indices = []
        self.quick_sort(0, len(self.array) - 1, sorted_indices)
        
        # Mark all elements as sorted at the end
        sorted_indices = list(range(len(self.array)))
        self.add_step(sorted_indices=sorted_indices)
        
        return self.steps
