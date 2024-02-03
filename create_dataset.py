import csv
import random

class StudentMealDataGenerator:
    def __init__(self, num_students, num_days):
        self.num_students = num_students
        self.num_days = num_days

    def random_choice(self, a, b):
        return random.choice([a, b])

    def generate_student_data(self, student_id):
        data = []
        for day in range(1, self.num_days + 1):
            day_of_week = (day - 1) % 7 + 1
            breakfast = self.random_choice(day_of_week, 0)
            lunch = self.random_choice(day_of_week, 0)
            snacks = self.random_choice(day_of_week, 0)
            dinner = self.random_choice(day_of_week, 0)
            data.append([student_id, day_of_week, breakfast, lunch, snacks, dinner])
        return data

    def save_to_csv(self, filename, data):
        with open(filename, 'w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(['student_id','Day_of_Week','breakfast', 'lunch', 'snacks', 'dinner'])
            writer.writerows(data)

    def generate_and_save_data_for_students(self):
        for student_id in range(1, self.num_students + 1):
            student_data = self.generate_student_data(student_id)
            filename = f'student_{student_id}_data.csv'
            self.save_to_csv(filename, student_data)

