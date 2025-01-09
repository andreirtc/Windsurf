from collections import defaultdict
import heapq

class Graph:
    def __init__(self):
        self.stations = {}  # Store station details
        self.edges = defaultdict(list)  # Adjacency list
        self.lines = {
            'LRT1': [],  # Green Line
            'LRT2': [],  # Purple Line
            'MRT3': []   # Yellow Line
        }
        self.initialize_stations()
        
    def initialize_stations(self):
        # LRT Line 1 (Green Line)
        lrt1_stations = [
            "Fernando Poe Jr.", "Balintawak", "Monumento", "5th Avenue", "R. Papa",
            "Abad Santos", "Blumentritt", "Tayuman", "Bambang", "Doroteo Jose",
            "Carriedo", "Central Terminal", "United Nations", "Pedro Gil", "Quirino",
            "Vito Cruz", "Gil Puyat", "Libertad", "EDSA", "Baclaran",
            "Redemptorist - Aseana", "MIA", "Asia World", "Ninoy Aquino Ave.", "Dr. Santos"
        ]
        
        # LRT Line 2 (Purple Line)
        lrt2_stations = [
            "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz", "Gilmore",
            "Betty Go-Belmonte", "Araneta Center-Cubao", "Anonas", "Katipunan",
            "Santolan", "Marikina-Pasig", "Antipolo"
        ]
        
        # MRT Line 3 (Yellow Line)
        mrt3_stations = [
            "North Avenue", "Quezon Avenue", "GMA Kamuning", "Araneta Center-Cubao",
            "Santolan-Annapolis", "Ortigas", "Shaw Boulevard", "Boni", "Guadalupe",
            "Buendia", "Ayala", "Magallanes", "Taft Avenue"
        ]
        
        # Add stations with their line information
        for station in lrt1_stations:
            self.add_station(station, 'LRT1')
            self.lines['LRT1'].append(station)
            
        for station in lrt2_stations:
            self.add_station(station, 'LRT2')
            self.lines['LRT2'].append(station)
            
        for station in mrt3_stations:
            self.add_station(station, 'MRT3')
            self.lines['MRT3'].append(station)
            
        # Connect stations within each line
        self._connect_line_stations('LRT1', lrt1_stations)
        self._connect_line_stations('LRT2', lrt2_stations)
        self._connect_line_stations('MRT3', mrt3_stations)
        
        # Connect interchange stations
        self.add_edge("Doroteo Jose", "Recto", 5)  # LRT1-LRT2 connection
        self.add_edge("Araneta Center-Cubao", "Araneta Center-Cubao", 5)  # LRT2-MRT3 connection
        self.add_edge("EDSA", "Taft Avenue", 5)  # LRT1-MRT3 connection
        
    def _connect_line_stations(self, line, stations):
        for i in range(len(stations) - 1):
            self.add_edge(stations[i], stations[i + 1], 2)  # 2 minutes between adjacent stations
            self.add_edge(stations[i + 1], stations[i], 2)  # Add reverse direction
            
    def add_station(self, name, line):
        self.stations[name] = {'name': name, 'line': line}
        
    def add_edge(self, from_station, to_station, weight):
        self.edges[from_station].append((to_station, weight))
        self.edges[to_station].append((from_station, weight))  # For undirected graph
        
    def get_shortest_path(self, start, end):
        if start not in self.stations or end not in self.stations:
            return None, None

        # Initialize distances and predecessors
        distances = {station: float('infinity') for station in self.stations}
        distances[start] = 0
        predecessors = {station: None for station in self.stations}
        
        # Priority queue for Dijkstra's algorithm
        pq = [(0, start)]
        
        while pq:
            current_distance, current_station = heapq.heappop(pq)
            
            # If we've reached the destination
            if current_station == end:
                break
                
            # If we've found a longer path
            if current_distance > distances[current_station]:
                continue
                
            # Check all neighbors
            for neighbor, weight in self.edges[current_station]:
                distance = current_distance + weight
                
                if distance < distances[neighbor]:
                    distances[neighbor] = distance
                    predecessors[neighbor] = current_station
                    heapq.heappush(pq, (distance, neighbor))
        
        # If no path found
        if distances[end] == float('infinity'):
            return None, None
            
        # Reconstruct the path
        path = []
        current = end
        while current is not None:
            path.append(current)
            current = predecessors[current]
        path.reverse()
        
        return path, int(distances[end])

    def get_station_line(self, station):
        for line, stations in self.lines.items():
            if station in stations:
                if line == 'LRT1':
                    return 'LRT Line 1 (Green)'
                elif line == 'LRT2':
                    return 'LRT Line 2 (Purple)'
                elif line == 'MRT3':
                    return 'MRT Line 3 (Yellow)'
        return 'Unknown Line'

    def get_all_stations(self):
        return list(self.stations.keys())
        
    def get_lines(self):
        return self.lines
