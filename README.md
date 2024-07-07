# Solving Advanced Mathematics Using Optical Character Recognition

## Introduction

### Optical Character Recognition (OCR)
OCR is a technology that converts images of text into machine-readable text. It involves hardware and software to analyze and convert the content of physical documents into digital text for further processing. Our project leverages OCR for solving advanced mathematical equations quickly and accurately.

### Impact of Using OCR in Mathematics
- Efficiently solves complex math expressions that are difficult to input into calculators.
- Helps students verify their solutions.
- Our application integrates a camera to capture and solve mathematical equations, increasing accuracy and saving time.

## Working
Our model operates in two main parts: searching and solving mathematical equations using OCR.
![Picture 1](https://github.com/DarakhTech/OCR-Calculus/assets/54445464/c4d8c4df-53b6-4eb2-8c56-3d8c986d250e)

### Searching
1. **User Input**: User types a query in the search bar.
2. **Backend Processing**: Python backend determines the type of problem and sends the result to the frontend.

### Scanning
1. **Camera Interface**: Users can upload or scan images.
2. **Image Processing**: Image is stored in Firebase and processed by our OCR model.
3. **Solution Generation**: The OCR model converts the image to LaTeX format, which is then solved by the backend and displayed to the user.
![Workflow](https://github.com/DarakhTech/OCR-Calculus/assets/54445464/819c9ae2-912b-4a19-b153-fb41811363cc)

## Image to Markup Model

### Basic Architecture
- **Encoder**: Standardizes the image size, extracts visual features using a Deep CNN, and enables modeling longer sequences.
- **Decoder**: A Recurrent Neural Network (DRNN) that generates the output word sequence based on previous words and image regions attended to.

### Proposed Method
1. **Image Input**
2. **Equation Scanning**
3. **Gray Scaling**
4. **Binarization**
5. **Character Recognition**: Using Tesseract OCR to detect text.
6. **Blob Detection**: Identifies connected components in the binary image.
7. **Parsed Into Equation**: Converts recognized characters into mathematical equations.
8. **Computer Algebra System**: Solves the equations.
9. **Image Output**: Displays the solved equations.

## Performance Analysis
Our model achieves more than 75% accuracy with less than 20% training loss.

## Conclusion
Our project demonstrates the potential of OCR technology in solving advanced mathematical equations efficiently and accurately.

![New Project (1)](https://github.com/DarakhTech/OCR-Calculus/assets/54445464/1d0044bc-082d-493f-ab64-bef25cda2787)


## Future Improvements
- Expand to other mathematical domains.
- Implement Artificial General Intelligence for broader applications.

P.S. Before making the repo public, I had to remove all the AWS Server commits, 
but couldn't find any way to hide the credentials from the commit history. 
Finally after couple of hours decided to just clone the branch and delete the main branch so that there isnt any trace of the commit 
