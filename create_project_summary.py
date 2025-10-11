import os

# --- CONFIGURATION ---
# Add any directories you want to ignore to this set
IGNORE_DIRECTORIES = {'.git', '.next', '.vscode', 'node_modules', 'Reference', 'scripts', 'dist'}
# --- END CONFIGURATION ---


def get_folder_structure(path, indent="", ignore_list=None):
    """
    Recursively generates a string representing the folder structure,
    ignoring specified directories.
    """
    if ignore_list is None:
        ignore_list = set()

    structure = ""
    try:
        # Filter out ignored directories and files from the list
        items = sorted([item for item in os.listdir(path) if item not in ignore_list])
    except FileNotFoundError:
        return "" # If a directory doesn't exist, return an empty string

    for i, item in enumerate(items):
        item_path = os.path.join(path, item)
        is_last = i == len(items) - 1
        prefix = "└── " if is_last else "├── "
        structure += f"{indent}{prefix}{item}\n"
        if os.path.isdir(item_path):
            new_indent = indent + ("    " if is_last else "│   ")
            # Pass the same ignore_list for recursive calls
            structure += get_folder_structure(item_path, new_indent, ignore_list=ignore_list)
    return structure

def find_and_append_tsx_files(path, output_file, ignore_list=None):
    """
    Finds all .tsx files, ignoring specified directories, and appends
    their content to the output file.
    """
    if ignore_list is None:
        ignore_list = set()

    for root, dirs, files in os.walk(path):
        # Prune the search: modify dirs in-place to exclude ignored directories
        dirs[:] = [d for d in dirs if d not in ignore_list]

        for file in files:
            if file.endswith(".tsx"):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    output_file.write(f"\n{'='*80}\n")
                    output_file.write(f"// FILE: {file_path}\n")
                    output_file.write(f"{'='*80}\n\n")
                    output_file.write(content)
                except Exception as e:
                    output_file.write(f"\n{'='*80}\n")
                    output_file.write(f"// ERROR READING FILE: {file_path}\n")
                    output_file.write(f"// REASON: {e}\n")
                    output_file.write(f"{'='*80}\n\n")

def main():
    """
    Main function to generate the project summary.
    """
    project_path = "."  # Current directory
    output_filename = "project_summary.txt"

    try:
        with open(output_filename, 'w', encoding='utf-8') as output_file:
            # 1. Add the folder structure to the top of the file
            output_file.write("Project Folder Structure\n")
            output_file.write("========================\n")
            # Get the root folder name to start the structure
            root_folder_name = os.path.basename(os.path.abspath(project_path))
            output_file.write(f"{root_folder_name}/\n")
            folder_structure = get_folder_structure(project_path, indent=" ", ignore_list=IGNORE_DIRECTORIES)
            output_file.write(folder_structure)
            output_file.write("\n\n")

            # 2. Add the content of all .tsx files
            output_file.write("Concatenated TSX Files\n")
            output_file.write("========================\n")
            find_and_append_tsx_files(project_path, output_file, ignore_list=IGNORE_DIRECTORIES)

        print(f"✅ Success! Project summary created at: '{output_filename}'")

    except Exception as e:
        print(f"❌ An error occurred: {e}")

if __name__ == "__main__":
    main()