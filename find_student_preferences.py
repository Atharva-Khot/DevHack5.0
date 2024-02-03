import csv
import pandas as pd

class FoodData:
    def __init__(self, file_name,student_id):
        self.student_id=student_id
        self.count = self.count_values(file_name, [])
        self.data = self.load_data(file_name)
        self.count_dict = self.calculate_counts(self.data)
        self.percentage_dict = self.calculate_percentages(self.count_dict)

    def load_data(self, file_name):
        with open(file_name, 'r') as file:
            reader = csv.reader(file)
            header = next(reader)
            data = list(reader)
        return data

    def calculate_counts(self, data):
        count_dict = {day: {meal_time: 0 for meal_time in ['breakfast', 'lunch', 'snacks', 'dinner']} for day in range(1, 8)}
        for row in data:
            day = int(row[1])
            count_dict[day]['breakfast'] += int(row[2])//day
            count_dict[day]['lunch'] += int(row[3])//day
            count_dict[day]['snacks'] += int(row[4])//day
            count_dict[day]['dinner'] += int(row[5])//day
        return count_dict
    
    def count_values(self, filename, lst):
        df = pd.read_csv(filename)
        for i in range(1, 8):
            lst.append(df[df['Day_of_Week'] == i].shape[0])
        return lst
                
    def calculate_percentages(self, count_dict):
        percentage_dict = {}
        for day, counts in count_dict.items():
            day_percentages = {}
            for meal_time, count in counts.items():
                day_percentages[meal_time] = round((count / self.count[int(day)-1]) * 100, 2)
            percentage_dict[day] = day_percentages
        return percentage_dict
        
    def save_percentage_data(self, file_name):
        with open(file_name, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['student_id','Day', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'])
            for day, counts in self.percentage_dict.items():
                writer.writerow([self.student_id,day, *counts.values()])