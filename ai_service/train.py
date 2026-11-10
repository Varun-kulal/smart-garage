import os
import json
import sys

# Supported part categories in exact order/names matching database keys
CLASSES = [
    'Air Filter',
    'Alloy Wheel',
    'Alternator',
    'Battery',
    'Brake Disc',
    'Brake Pad',
    'Clutch Plate',
    'Engine',
    'Fuel Pump',
    'Headlight',
    'Oil Filter',
    'Radiator',
    'Shock Absorber',
    'Side Mirror',
    'Spark Plug',
    'Suspension',
    'Tail Light',
    'Timing Belt',
    'Tire',
    'Windshield'
]

print("==================================================")
print("   SMART GARAGE HUB - AI CLASSIFIER TRAINING")
print("==================================================")

try:
    import numpy as np
    from PIL import Image
    import tensorflow as tf
    from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2
    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
    from tensorflow.keras.models import Model
    from tensorflow.keras.preprocessing.image import ImageDataGenerator
except ImportError as e:
    print(f"\n[ERROR] Missing required Python package: {e.name}")
    print("Please install the required dependencies using pip:")
    print("    pip install tensorflow numpy pillow")
    print("\nAborting model training.")
    sys.exit(1)

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.join(BASE_DIR, 'dataset')
MODEL_PATH = os.path.join(BASE_DIR, 'car_parts_model.h5')
CLASSES_PATH = os.path.join(BASE_DIR, 'classes.json')

# Parameters
IMAGE_SIZE = (224, 224)
BATCH_SIZE = 16
EPOCHS = 10

def check_dataset():
    """Verify that there are enough images in the folders to train."""
    if not os.path.exists(DATASET_DIR):
        print(f"[ERROR] Dataset directory not found at: {DATASET_DIR}")
        print("Please create the dataset folders and add images first.")
        return False

    missing_folders = []
    total_images = 0
    folder_counts = {}

    for c in CLASSES:
        folder_path = os.path.join(DATASET_DIR, c)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
            missing_folders.append(c)
            folder_counts[c] = 0
        else:
            files = [f for f in os.listdir(folder_path) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
            folder_counts[c] = len(files)
            total_images += len(files)

    print("\nDataset Status:")
    for folder, count in folder_counts.items():
        print(f"  - {folder}: {count} images")

    if total_images < 12:
        print("\n[WARNING] Very few images found in your dataset folder.")
        print("To train a robust deep learning model, please add at least 5-10 images per category.")
        print(f"Total images found: {total_images}. Minimum required to start training: 12 (1 per class).")
        if total_images == 0:
            return False
    
    return True

def train():
    if not check_dataset():
        print("\n[ERROR] Training cannot proceed. Please add sample images to your dataset/ folders.")
        sys.exit(1)

    print("\n[1/4] Loading and Preprocessing Dataset...")
    
    # Configure ImageDataGenerator with augmentation for better accuracy with small datasets
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        horizontal_flip=True,
        validation_split=0.2  # 20% for validation/testing
    )

    train_generator = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        classes=CLASSES,
        subset='training',
        shuffle=True
    )

    validation_generator = datagen.flow_from_directory(
        DATASET_DIR,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        classes=CLASSES,
        subset='validation',
        shuffle=False
    )

    num_classes = len(CLASSES)
    print(f"\nFound {train_generator.samples} training images and {validation_generator.samples} validation images across {num_classes} categories.")

    print("\n[2/4] Initializing MobileNetV2 Base Model...")
    # Load MobileNetV2 pre-trained on ImageNet
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze the base layers so we only train the classification head initially
    base_model.trainable = False

    # Build classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    x = Dropout(0.5)(x)
    predictions = Dense(num_classes, activation='softmax')(x)

    model = Model(inputs=base_model.input, outputs=predictions)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )

    print("\n[3/4] Training Custom Layer (Fine-Tuning)...")
    
    # Force fewer epochs if dataset is extremely tiny
    epochs = EPOCHS
    if train_generator.samples < 24:
        epochs = 3
        print("[NOTE] Tiny dataset detected. Setting epochs to 3 for quick execution.")

    history = model.fit(
        train_generator,
        steps_per_epoch=max(1, train_generator.samples // BATCH_SIZE),
        validation_data=validation_generator,
        validation_steps=max(1, validation_generator.samples // BATCH_SIZE),
        epochs=epochs
    )

    print("\n[4/4] Saving Trained Model Weights...")
    model.save(MODEL_PATH)
    
    # Save mapping indices
    class_indices = {i: c for i, c in enumerate(CLASSES)}
    with open(CLASSES_PATH, 'w') as f:
        json.dump(class_indices, f, indent=2)

    print("==================================================")
    print(f"SUCCESS: Custom AI model saved to: {MODEL_PATH}")
    print(f"Class mapping saved to: {CLASSES_PATH}")
    print("The Flask AI server will now use this model for predictions!")
    print("==================================================")

if __name__ == '__main__':
    train()
