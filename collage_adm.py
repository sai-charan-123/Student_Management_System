class College:
    def __init__(self, name, marks_requirement):
        self.name = name
        self.marks_requirement = marks_requirement

def main():
    # Predefined/default colleges
    colleges = [
        College("Oxford University", 80),
        College("MITS", 70),
        College("VISWAM", 65),
        College("CAMBRIDGE UNIVERSITY", 87),
        College("Gnanambika",68)
    ]


    while True:
        print("\n---------------College Admissions System-------------")
        print("1. Select a College")     
        print("2. Apply to College")     
        print("3. Exit")                 

        choice = input("Choose an option: ")

        if choice == "1":
            print("\n----------Available Colleges:-----------")
            
            for i, college in enumerate(colleges):
                print(f"{i+1}. {college.name} (Marks Required: {college.marks_requirement})")



            try:
                selected_index = int(input("Select a college (by number): ")) - 1
                if selected_index < 0 or selected_index >= len(colleges):
    
                    print("Invalid choice. Please choose a valid college.")
                    continue
            except ValueError:
                print("Invalid input. Please enter a number.")
                continue

            selected_college = colleges[selected_index]
            print(f"You have selected: {selected_college.name}")

        elif choice == "2":
            if not colleges:
                print("No colleges available. Please create a college first.")
                continue

            
            if selected_college:
                use_selected = input(f"Apply to selected college: {selected_college.name}? (yes/no): ").strip().lower()
                if use_selected == 'yes':
                    college_choice = colleges.index(selected_college)
                else:
                    selected_college = None  # Reset and let user choose
            if not selected_college:
                print("\nAvailable Colleges:")
                for i, college in enumerate(colleges):
                    print(f"{i+1}. {college.name} (Marks Required: {college.marks_requirement})")

                try:
                    college_choice = int(input("Choose a college (by number): ")) - 1
                    if college_choice < 0 or college_choice >= len(colleges):
                        print("Invalid choice. Please choose a valid college.")
                        continue

                except ValueError:
                    print("Invalid input. Please enter a number.")
                    continue

                selected_college = colleges[college_choice]

            student_name = input("Enter student name: ")
            try:
                marks = float(input("Enter student marks: "))

            except ValueError:
                print("Invalid marks input. Please enter a valid number.")
                continue

            if marks >= selected_college.marks_requirement:
                print(f"{student_name} has been accepted into {selected_college.name}!")
            else:
                print(f"Sorry, {student_name} did not meet the requirement for {selected_college.name}.")

        elif choice == "3":
            print("---------------THANK YOU FOR VISITING-------------")
            break

        else:
            print("Invalid option. Please choose 1, 2, or 3.")

main()