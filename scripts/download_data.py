import os
import urllib.request

def download_dataset():
    url = "https://raw.githubusercontent.com/itachi9604/Healthcare-Chatbot-/master/Data/dataset.csv"
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "backend", "data")
    os.makedirs(data_dir, exist_ok=True)
    
    output_path = os.path.join(data_dir, "dataset.csv")
    print(f"Downloading dataset to {output_path}...")
    
    try:
        urllib.request.urlretrieve(url, output_path)
        print("Download completed successfully!")
    except Exception as e:
        print(f"Failed to download dataset: {e}")
        # Create a tiny mock dataset as fallback to ensure training doesn't crash completely
        print("Creating a minimal synthetic dataset as fallback...")
        with open(output_path, "w") as f:
            f.write("Disease,Symptom_1,Symptom_2,Symptom_3\n")
            f.write("Influenza,fever,cough,fatigue\n")
            f.write("Common Cold,cough,sneezing,fatigue\n")
            f.write("COVID-19,fever,cough,loss_of_smell\n")
            f.write("Allergy,sneezing,itching,watery_eyes\n")
            f.write("Asthma,cough,shortness_of_breath,wheezing\n")
            f.write("Gastroenteritis,vomiting,diarrhea,abdominal_pain\n")
        print("Fallback dataset created.")

if __name__ == "__main__":
    download_dataset()
