import pandas as pd
from sklearn.ensemble import RandomForestClassifier

# Load the data
data = {'student_id': [1],
        'Day': [1, 2, 3, 4, 5, 6, 7],
        'Breakfast': [0.0, 80.0, 50.0, 75.0, 50.0, 50.0, 50.0],
        'Lunch': [60.0, 20.0, 75.0, 100.0, 50.0, 0.0, 25.0],
        'Snacks': [0.0, 40.0, 25.0, 25.0, 50.0, 25.0, 50.0],
        'Dinner': [60.0, 40.0, 100.0, 50.0, 25.0, 25.0, 50.0]}
student_data = pd.DataFrame(data)

# Train the model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(student_data.drop(columns=['student_id', 'Day']), student_data['Day'])

# Get the current day
import datetime
current_day = datetime.datetime.today().strftime('%A')

# Get the next day
next_days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
next_day_index = (next_days.index(current_day) + 1) % 7
next_day = next_days[next_day_index]

# Check if the next day is in the training data
if next_day_index != 6:  # If tomorrow is not Sunday
    favorite_meals = []
    for meal in ['Breakfast', 'Lunch', 'Snacks', 'Dinner']:
        if model.predict(student_data.drop(columns=['student_id', 'Day', meal])) > 0.5:
            favorite_meals.append(meal)
    if favorite_meals:
        print(f"Student 1: Your {', '.join(favorite_meals)} consumption is more than 50% of the time tomorrow. Enjoy your favorite meals!")
else:
    print(f"Today is {current_day}. Check tomorrow if it's Sunday to see if there are any favorite meals.")