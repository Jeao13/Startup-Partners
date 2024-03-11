import io from 'socket.io-client';

document.addEventListener('DOMContentLoaded', () => {
    const socket = io('http://localhost:3000');

    const sendMessageButton = document.getElementById('sendMessageButton');

    sendMessageButton.addEventListener('click', () => {
        socket.emit('chatMessage', 'Hello from client!');
    });

    // Add event listener for receiving messages from the server
    socket.on('messageToClient', handleMessageFromBackend);

    // Function to handle the message received from the backend
    function handleMessageFromBackend(data) {
        console.log('Message received from backend:', data);
        // Handle the received message here
        alert(data.message); // Display the message in an alert
    }
});

// Function to handle the message received from the backend
const handleMessageFromBackend = (data) => {
    console.log('Message received from backend:', data);
    // Handle the received message here
    // For example, you can display the message on the frontend
    // You can customize this based on your application's requirements
    alert(data.message); // Display the message in an alert
  };
  
  // Listen for the 'messageToClient' event emitted by the backend
  socket.on('messageToClient', handleMessageFromBackend);




async function CreatePost() {
    const title = document.getElementById('title').value;
    console.log(title);
    const author = "Aedrian Jeao";
    const content = document.getElementById('body').value;
    const account_fkid = "1";
    const profile_fkid = "1";
    let imageData = null;

    // Get the file input element
    const fileInput = document.getElementById('imageInput');
    // Check if a file is selected
    if (fileInput.files.length > 0) {
        // Get the selected file
        const file = fileInput.files[0];
        // Read the file as a data URL
        imageData = await readFileAsDataURL(file);
        console.log(imageData);
    }

    try {
        const postData = {
            title: title,
            author: author,
            content: content,
            account_fkid: account_fkid,
            profile_fkid:profile_fkid,
            image: imageData
        };

        console.log(postData);

        const response = await fetch('http://localhost:3000/api/v1/community/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage || 'Failed to upload profile');
        }

        alert('Profile uploaded successfully!');
        window.location.reload();
    } catch (error) {
        console.error('Error uploading profile:', error);
        alert('Failed to upload profile. Please try again.');
    }
}

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}


function bufferToImageURL(buffer) {
    const uint8Array = new Uint8Array(buffer);
    const blob = new Blob([uint8Array], { type: 'image/jpeg' });
    return URL.createObjectURL(blob);
}

async function fetchPost() {
    var postContainer = document.getElementById('posts');
    try {
        const response = await fetch(`http://localhost:3000/api/v1/community/post`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post data');
        }

        const postData = await response.json();

        let postContent = '';

        for (const post of postData.data) {

            const currentPostContent = `
                <div class="d-flex mb-4 mt-4 rounded bg-glassy position-relative">
                    <div class="dropdown" style="position: absolute; top: 10px; right: 20px;">
                        <button class="btn btn-light rounded" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#">Edit</a></li>
                            <li><a class="dropdown-item" href="#">Delete</a></li>
                            <li><a class="dropdown-item" href="#">Report</a></li>
                        </ul>
                    </div>
                    <img src="../img/logo2.png" class="me-3 m-4" alt="Bootstrap" width="40" height="40" style="border: 1px solid #efa92a; border-radius: 50%;">
                    <div class="d-flex flex-column">
                        <div class="mt-4 mb-1">
                            <h5 style="margin-bottom: 0; font-size: 16px;">${post.author}</h5>
                            <p style="margin-bottom: 0; font-size:11px;">${post.timestamp}</p>
                        </div>
                        <div class="mt-2">
                            <h4>${post.title}</h4>
                        </div>
                        <div id="wow" class="bg-light rounded d-flex align-self-center" data-bs-toggle="modal" data-bs-target="#fullScreenModal" style="width: auto; height: auto; border: 1px solid black; overflow: hidden; margin-right:60px;">
                            <div class="position-relative">
                                <img src="${post.image}" class="img-fluid">
                                <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white clickable" onclick="postModal(${post.post_id})" style="background-color: rgba(0, 0, 0, 0.5); display: none;">
                                    <span>View Post</span>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex mt-2 mb-2">
                            <div class="btn-group">
                                <button type="button" style="border-top: 1px solid #efa92a; border-left: 1px solid #efa92a; border-bottom: 1px solid #efa92a;" class="btn" aria-current="page">
                                    <i class="fas fa-arrow-up me-1" style="color: #efa92a;"></i>
                                    <span style="font-size: 15px;">17</span>
                                </button>
                                <button type="button" style="border-top: 1px solid #0e3370; border-right: 1px solid #0e3370; border-bottom: 1px solid #0e3370;" class="btn">
                                    <i class="fas fa-arrow-down me-1" style="color:#0e3370"></i>
                                </button>
                            </div>
                            <button class="btn btn-light rounded ms-1" style="background-color:whitesmoke; border: 1px solid #efa92a;">
                                <i class="fas fa-comments me-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;

            postContent += currentPostContent;
        }

        postContainer.innerHTML = postContent;
    } catch (error) {
        console.error('Error fetching post data:', error.message);
    }
}


async function postModal(id) {
    try {
        // Retrieve the title modal container
        var titleModalContainer = document.getElementById('titlemodal');
        var contentModalContainer = document.getElementById('contentainer');
        var imageModalContainer =  document.getElementById('imgmodal')
       
        const existingTitle = titleModalContainer.querySelector('h1');
        if (existingTitle) {
            existingTitle.remove();
        }

        const existingContent = contentModalContainer.querySelector('p');
        if(existingContent){
            existingContent.remove();
        }

        

        // Fetch post data
        const response = await fetch(`http://localhost:3000/api/v1/community/post/id=${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post data');
        }

        const postData = await response.json();

        console.log(postData);

        // Check if postData.data is an array and has at least one element
        if (Array.isArray(postData.data) && postData.data.length > 0) {
            const firstPost = postData.data[0]; // Access the first element
            // Create the content for the modal title
            const titleModalContent = document.createElement('h1');
            titleModalContent.classList.add('modal-title', 'fs-5');
            titleModalContent.id = 'staticBackdropLabel';
            titleModalContent.textContent = firstPost.title; // Access the title property

            // Find the div with class "ms-auto"
            const msAutoDiv = titleModalContainer.querySelector('.ms-auto');
            // Insert the titleModalContent after the msAutoDiv
            msAutoDiv.insertAdjacentElement('beforebegin', titleModalContent);

            // Content
            const contentmodalContent = document.createElement('p');
            contentmodalContent.textContent = firstPost.content;
            console.log(firstPost.content);
            
            const contentModalContainer = document.getElementById('contentainer');
            const contentstop = document.getElementById('contentstop'); 
            
            contentModalContainer.insertBefore(contentmodalContent, contentstop);

            //Image
            const imageModalContent = ` <img src="${firstPost.image}" class="img-fluid">
            <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white clickable" style="background-color: rgba(0, 0, 0, 0.5); display: none;">
                <span>View Post</span>
            </div>`

            imageModalContainer.innerHTML = imageModalContent;






       
        } else {
            console.error('No post data found');
        }





    } catch (error) {
        console.error('Error fetching post data:', error);
    }
}


