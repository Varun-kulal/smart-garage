# Smart Garage Hub AI Dataset Folder

This directory contains folders for each of the 12 supported car part categories. To train the AI model with your own images, follow these steps:

1. **Collect Images**: Collect 20-100 high-quality images for each car part category. Supported formats: `.jpg`, `.jpeg`, `.png`.
2. **Put Images in Corresponding Subfolders**: Place images for the corresponding parts in their folders:
   - `Air Filter/`
   - `Alternator/`
   - `Battery/`
   - `Brake Pad/`
   - `Clutch Plate/`
   - `Engine/`
   - `Fuel Injector/`
   - `Headlight/`
   - `Radiator/`
   - `Spark Plug/`
   - `Suspension/`
   - `Tire/`
3. **Install Dependencies**: Make sure you have python, pip, and tensorflow installed:
   ```bash
   pip install tensorflow numpy pillow
   ```
4. **Run Training Script**: In the `ai_service/` directory, run:
   ```bash
   python train.py
   ```
5. **Verify**: The script will output `car_parts_model.h5` when finished. The Flask AI server (`app.py`) will automatically detect and load this model to provide highly accurate, custom image recognition!
