from create_dataset import StudentMealDataGenerator
from find_student_preferences import FoodData

def main():
    # Generating and saving data for 5 students
    num_students = 5
    data_generator = StudentMealDataGenerator(num_students,30)
    data_generator.generate_and_save_data_for_students()
    for i in range(1,num_students+1):
        per_generator=FoodData(f'student_{i}_data.csv',i)
        per_generator.save_percentage_data(f'student_{i}_perdata.csv')

if __name__ == "__main__":
    main()
