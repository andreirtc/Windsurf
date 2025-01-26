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
                sorted_indices: List[int] = None, array: List[int] = None, currentMin: int = None, moving_down: bool = False) -> None:
        """Add a step to the sorting process."""
        step = {
            'array': array if array is not None else self.array.copy(),
            'comparing': comparing if comparing is not None else [],
            'swapping': swapping if swapping is not None else [],
            'sorted': sorted_indices if sorted_indices is not None else [],
            'currentMin': currentMin,
            'moving_down': moving_down
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
        
        # Initial state - all bars violet
        self.add_step(comparing=[], sorted_indices=[], currentMin=None)
        
        for i in range(n):
            min_idx = i
            
            # Start new iteration - show current minimum
            step = {
                'array': self.array.copy(),
                'comparing': [],
                'currentMin': min_idx,
                'sorted': sorted_indices.copy(),
                'swapping': []
            }
            self.steps.append(step)
            
            # Move green bar through each position
            for j in range(i + 1, n):
                # Show green bar at current position j
                step = {
                    'array': self.array.copy(),
                    'comparing': [j],  # Only show current position as comparing
                    'currentMin': min_idx,
                    'sorted': sorted_indices.copy(),
                    'swapping': []
                }
                self.steps.append(step)
                
                # Compare and update minimum if needed
                if self.array[j] < self.array[min_idx]:
                    # Update minimum position
                    min_idx = j
                    
                    # Show the new minimum
                    step = {
                        'array': self.array.copy(),
                        'comparing': [j],  # Keep showing current position
                        'currentMin': min_idx,
                        'sorted': sorted_indices.copy(),
                        'swapping': []
                    }
                    self.steps.append(step)
            
            # After finding minimum, prepare for swap if needed
            if min_idx != i:
                # Show positions that will be swapped
                step = {
                    'array': self.array.copy(),
                    'comparing': [i],  # Show first swap position
                    'currentMin': min_idx,
                    'sorted': sorted_indices.copy(),
                    'swapping': [i, min_idx]
                }
                self.steps.append(step)
                
                # Perform swap
                self.array[i], self.array[min_idx] = self.array[min_idx], self.array[i]
                
                # Show state after swap
                step = {
                    'array': self.array.copy(),
                    'comparing': [],
                    'currentMin': None,
                    'sorted': sorted_indices.copy(),
                    'swapping': []
                }
                self.steps.append(step)
            
            # Mark current position as sorted
            sorted_indices.append(i)
            step = {
                'array': self.array.copy(),
                'comparing': [],
                'currentMin': None,
                'sorted': sorted_indices.copy(),
                'swapping': []
            }
            self.steps.append(step)
        
        # Mark the last element as sorted if not already
        if n-1 not in sorted_indices:
            sorted_indices.append(n-1)
            step = {
                'array': self.array.copy(),
                'comparing': [],
                'currentMin': None,
                'sorted': sorted_indices.copy(),
                'swapping': []
            }
            self.steps.append(step)
        
        return self.steps

class InsertionSort(SortingAlgorithm):
    def sort(self) -> List[Dict[str, Any]]:
        n = len(self.array)
        sorted_indices = []
        
        # Initial state - all bars violet
        self.add_step(comparing=[], sorted_indices=[], currentMin=None)
        
        # First element is already sorted
        sorted_indices.append(0)
        self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=None)
        
        for i in range(1, n):
            key = self.array[i]
            j = i - 1
            
            # Show current key element before moving it
            self.add_step(comparing=[i], sorted_indices=sorted_indices.copy(), currentMin=i)
            
            # Create a temporary array for visualization
            temp_array = self.array.copy()
            current_pos = i
            
            while j >= 0 and self.array[j] > key:
                # Move elements in the actual array
                self.array[j + 1] = self.array[j]
                
                # For visualization, show the key element moving down
                temp_array = self.array.copy()
                temp_array[j] = key  # Show key in its current comparison position
                
                self.add_step(
                    comparing=[j],
                    sorted_indices=sorted_indices.copy(),
                    currentMin=i,
                    array=temp_array
                )
                j -= 1
            
            # Place key in correct position
            self.array[j + 1] = key
            sorted_indices.append(i)
            sorted_indices.sort()  # Keep indices in order
            
            # Show final placement
            self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=None)
        
        # Final state - all elements sorted
        self.add_step(comparing=[], sorted_indices=list(range(n)), currentMin=None)
        
        return self.steps

class MergeSort(SortingAlgorithm):
    def sort(self) -> List[Dict[str, Any]]:
        # Clear previous steps and start fresh
        self.steps = []
        
        def merge(left: int, mid: int, right: int, sorted_indices: List[int]) -> None:
            left_half = self.array[left:mid + 1]
            right_half = self.array[mid + 1:right + 1]
            
            i = j = 0
            k = left
            temp_array = self.array.copy()
            
            # Show the subarrays being merged
            self.steps.append({
                'array': self.array.copy(),
                'comparing': [],
                'merging': [],
                'sorted': sorted_indices.copy(),
                'subarrays': [[left, mid], [mid + 1, right]],
                'depth': [0] * len(self.array)
            })
            
            while i < len(left_half) and j < len(right_half):
                # Compare elements
                self.steps.append({
                    'array': temp_array.copy(),
                    'comparing': [left + i, mid + 1 + j],
                    'merging': [],
                    'sorted': sorted_indices.copy(),
                    'subarrays': [[left, mid], [mid + 1, right]],
                    'depth': [0] * len(self.array)
                })
                
                if left_half[i] <= right_half[j]:
                    temp_array[k] = left_half[i]
                    self.array[k] = left_half[i]
                    i += 1
                else:
                    temp_array[k] = right_half[j]
                    self.array[k] = right_half[j]
                    j += 1
                
                # Show merging step
                self.steps.append({
                    'array': temp_array.copy(),
                    'comparing': [],
                    'merging': [k],
                    'sorted': sorted_indices.copy(),
                    'subarrays': [[left, mid], [mid + 1, right]],
                    'depth': [0] * len(self.array)
                })
                k += 1
            
            # Copy remaining elements from left half
            while i < len(left_half):
                temp_array[k] = left_half[i]
                self.array[k] = left_half[i]
                self.steps.append({
                    'array': temp_array.copy(),
                    'comparing': [],
                    'merging': [k],
                    'sorted': sorted_indices.copy(),
                    'subarrays': [[left, mid], [mid + 1, right]],
                    'depth': [0] * len(self.array)
                })
                i += 1
                k += 1
            
            # Copy remaining elements from right half
            while j < len(right_half):
                temp_array[k] = right_half[j]
                self.array[k] = right_half[j]
                self.steps.append({
                    'array': temp_array.copy(),
                    'comparing': [],
                    'merging': [k],
                    'sorted': sorted_indices.copy(),
                    'subarrays': [[left, mid], [mid + 1, right]],
                    'depth': [0] * len(self.array)
                })
                j += 1
                k += 1
            
            # Check if this subarray is sorted
            is_sorted = True
            for i in range(left, right):
                if self.array[i] > self.array[i + 1]:
                    is_sorted = False
                    break
            
            # If sorted, mark all elements in this range as sorted
            if is_sorted:
                for idx in range(left, right + 1):
                    if idx not in sorted_indices:
                        sorted_indices.append(idx)
                sorted_indices.sort()
            
            # Show the merged result
            self.steps.append({
                'array': self.array.copy(),
                'comparing': [],
                'merging': [],
                'sorted': sorted_indices.copy(),
                'subarrays': [],
                'depth': [0] * len(self.array)
            })
        
        def merge_sort(left: int, right: int, sorted_indices: List[int]) -> None:
            if left < right:
                mid = (left + right) // 2
                
                # Show current subarray being divided
                self.steps.append({
                    'array': self.array.copy(),
                    'comparing': [],
                    'merging': [],
                    'sorted': sorted_indices.copy(),
                    'subarrays': [[left, mid], [mid + 1, right]],
                    'depth': [0] * len(self.array)
                })
                
                # Recursively sort both halves
                merge_sort(left, mid, sorted_indices)
                merge_sort(mid + 1, right, sorted_indices)
                
                # Merge the sorted halves
                merge(left, mid, right, sorted_indices)
                
                # After merging, check if the entire range is sorted
                if left == 0 and right == len(self.array) - 1:
                    # This is the final merge, mark all elements as sorted
                    sorted_indices.clear()
                    sorted_indices.extend(range(len(self.array)))
                    self.steps.append({
                        'array': self.array.copy(),
                        'comparing': [],
                        'merging': [],
                        'sorted': sorted_indices.copy(),
                        'subarrays': [],
                        'depth': [0] * len(self.array)
                    })
        
        # Initial state - no elements sorted
        sorted_indices = []
        
        # Start the merge sort immediately
        merge_sort(0, len(self.array) - 1, sorted_indices)
        
        return self.steps

class QuickSort(SortingAlgorithm):
    def sort(self) -> List[Dict[str, Any]]:
        def partition(low: int, high: int, sorted_indices: List[int]) -> int:
            # Use leftmost element as pivot
            pivot = self.array[low]
            i = low + 1
            j = high
            
            # Show pivot element
            self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=low)
            
            while True:
                # Move i right while elements are less than pivot
                while i <= j and self.array[i] <= pivot:
                    self.add_step(comparing=[i], sorted_indices=sorted_indices.copy(), currentMin=low)
                    i += 1
                
                # Move j left while elements are greater than pivot
                while i <= j and self.array[j] > pivot:
                    self.add_step(comparing=[j], sorted_indices=sorted_indices.copy(), currentMin=low)
                    j -= 1
                
                # If pointers crossed, break
                if i > j:
                    break
                
                # Swap elements
                self.array[i], self.array[j] = self.array[j], self.array[i]
                self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=low, swapping=[i, j])
            
            # Place pivot in correct position
            pivot_pos = j
            if pivot_pos != low:
                self.array[pivot_pos], self.array[low] = self.array[low], self.array[pivot_pos]
                self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=low, swapping=[pivot_pos, low])
            
            # Check if pivot is in its final position
            is_final_position = True
            for idx in range(low, pivot_pos):
                if self.array[idx] > self.array[pivot_pos]:
                    is_final_position = False
                    break
            for idx in range(pivot_pos + 1, high + 1):
                if self.array[idx] < self.array[pivot_pos]:
                    is_final_position = False
                    break
            
            if is_final_position and pivot_pos not in sorted_indices:
                sorted_indices.append(pivot_pos)
                sorted_indices.sort()
                self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=None)
            
            return pivot_pos
        
        def quick_sort(low: int, high: int, sorted_indices: List[int]) -> None:
            if low < high:
                # Get pivot position
                pivot_pos = partition(low, high, sorted_indices)
                
                # Recursively sort elements before and after pivot
                quick_sort(low, pivot_pos - 1, sorted_indices)
                quick_sort(pivot_pos + 1, high, sorted_indices)
                
                # Check if this range is fully sorted
                is_range_sorted = True
                for i in range(low, high):
                    if self.array[i] > self.array[i + 1]:
                        is_range_sorted = False
                        break
                
                if is_range_sorted:
                    for i in range(low, high + 1):
                        if i not in sorted_indices:
                            sorted_indices.append(i)
                    sorted_indices.sort()
                    self.add_step(comparing=[], sorted_indices=sorted_indices.copy(), currentMin=None)
        
        # Initial state - no elements sorted
        sorted_indices = []
        self.add_step(comparing=[], sorted_indices=[], currentMin=None)
        
        # Start quick sort
        quick_sort(0, len(self.array) - 1, sorted_indices)
        
        # Final state - mark any remaining elements as sorted
        final_sorted_indices = list(range(len(self.array)))
        self.add_step(comparing=[], sorted_indices=final_sorted_indices, currentMin=None)
        
        return self.steps
