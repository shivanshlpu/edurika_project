import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

def create_performance_graph():
    # Set the style
    sns.set_theme(style="whitegrid")
    
    # Data
    models = ['Logistic Regression', 'K-Nearest Neighbors', 'Decision Tree']
    accuracy = [100.0, 100.0, 100.0]
    precision = [100.0, 100.0, 100.0]
    recall = [100.0, 100.0, 100.0]
    
    x = np.arange(len(models))
    width = 0.25
    
    # Create the figure and axis
    fig, ax = plt.subplots(figsize=(10, 6), dpi=300)
    
    # Plot bars
    rects1 = ax.bar(x - width, accuracy, width, label='Accuracy', color='#3b82f6')
    rects2 = ax.bar(x, precision, width, label='Precision', color='#10b981')
    rects3 = ax.bar(x + width, recall, width, label='Recall', color='#f59e0b')
    
    # Add some text for labels, title and custom x-axis tick labels, etc.
    ax.set_ylabel('Score (%)', fontsize=12, fontweight='bold')
    ax.set_title('Model Performance Benchmarks on Holdout Test Set', fontsize=14, fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(models, fontsize=11)
    ax.legend(loc='lower center', bbox_to_anchor=(0.5, -0.2), ncol=3, frameon=False, fontsize=11)
    
    # Set y-axis limit slightly above 100 to make room for labels
    ax.set_ylim(90, 102)
    
    # Add value labels on top of bars
    def autolabel(rects):
        for rect in rects:
            height = rect.get_height()
            ax.annotate(f'{height:.0f}%',
                        xy=(rect.get_x() + rect.get_width() / 2, height),
                        xytext=(0, 3),  # 3 points vertical offset
                        textcoords="offset points",
                        ha='center', va='bottom', fontsize=10, fontweight='bold', color='#475569')
            
    autolabel(rects1)
    autolabel(rects2)
    autolabel(rects3)
    
    # Clean up layout
    plt.tight_layout()
    
    # Save the plot
    output_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend', 'public', 'performance_graph.png'))
    plt.savefig(output_path, bbox_inches='tight')
    print(f"Graph successfully saved to {output_path}")

if __name__ == "__main__":
    create_performance_graph()
