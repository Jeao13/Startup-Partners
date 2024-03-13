async function CreatePost() {
    const title = document.getElementById('title').value;
    console.log(title);
    const author = "Aedrian Jeao";
    const content = document.getElementById('body').value;
    const account_fkid = 1;
    const profile_fkid = 1;
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
        
        postData.data.sort((a, b) => {
            // First, sort by like_count in descending order
            if (b.like_count !== a.like_count) {
                return b.like_count - a.like_count;
            }
            // If like_count is the same, sort by dislike_count in ascending order
            return a.dislike_count - b.dislike_count;
        });

        let postContent = '';

        for (const post of postData.data) {

            const timestamp = new Date(post.timestamp);
            const formattedTimestamp = timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });


            const userVoteStatus = await checkUserVoteStatus(post.post_id, 1); // Assuming userId is 1
          
        
            let textcolor,likeButtonIcon, likeButtonColor, dislikeButtonIcon, dislikeButtonColor,likeButtonColoricon,dislikeButtonColoricon;

            if (userVoteStatus === 'upvote') {
                console.log("1");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#0e3370';
                textcolor = 'white';
                likeButtonColoricon = '#efa92a';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#efa92a';
                dislikeButtonColoricon = '#0e3370';
            } else if (userVoteStatus === 'downvote') {
                console.log("2");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#efa92a';
                likeButtonColoricon = '#0e3370';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#0e3370';
                dislikeButtonColoricon = '#efa92a';
            } else {
                console.log("3");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#efa92a';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#efa92a';
            }

            const currentPostContent = `
                <div class="d-flex mb-4 mt-4 rounded bg-glassy position-relative">
                    <div class="dropdown" style="position: absolute; top: 10px; right: 20px;">
                        <button class="btn btn-light rounded" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#">Delete</a></li>
                            <li><a class="dropdown-item" href="#">Report</a></li>
                        </ul>
                    </div>
                    <img src="../img/logo2.png" class="me-3 m-4" alt="Bootstrap" width="40" height="40" style="border: 1px solid #efa92a; border-radius: 50%;">
                    <div class="d-flex flex-column">
                        <div class="mt-4 mb-1">
                            <h5 style="margin-bottom: 0; font-size: 16px;">${post.author}</h5>
                            <p style="margin-bottom: 0; font-size:11px;">${formattedTimestamp}</p>
                        </div>


                        <div class="mt-2">
                            <h4>${post.title}</h4>
                        </div>
                          <div id="wow" class="bg-light rounded rounded d-flex align-self-center" data-bs-toggle="modal" data-bs-target="#fullScreenModal" style="max-width: 80%; height: auto; border: 1px solid black; overflow: hidden; margin-right:60px;">
                                <div class="position-relative" style="width: 100%; height: 100%;">
                                    <img src="${post.image}" class="img-fluid" alt="">
                                    <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white clickable" style="background-color: rgba(0, 0, 0, 0.5); display: none; " onclick="postModal(${post.post_id})">
                                        <span>View Post</span>
                                    </div>
                                </div>
                            </div>
                        <div class="d-flex mt-2 mb-2">
                        <div class="btn-group">
                            <button type="button" style="border-top: 1px solid ${likeButtonColor}; border-left: 1px solid ${likeButtonColor}; border-bottom: 1px solid ${likeButtonColor}; background-color:${likeButtonColor}" class="btn" onclick="upVote(${post.post_id},${post.like_count})" aria-current="page">
                                <i class="${likeButtonIcon} me-1" style="color: ${likeButtonColoricon};"></i>
                                <span style="font-size: 15px; color:${textcolor}">${post.like_count}</span>
                            </button>
                            <button type="button" style="border-top: 1px solid ${dislikeButtonColor}; border-right: 1px solid ${dislikeButtonColor}; border-bottom: 1px solid ${dislikeButtonColor}; background-color:${dislikeButtonColor}" class="btn" onclick="downVote(${post.post_id})">
                                <i class="${dislikeButtonIcon} me-1" style="color:${dislikeButtonColoricon};"></i>
                            </button>
                        </div>
                        <div data-bs-toggle="modal" data-bs-target="#fullScreenModal">
                        <button onclick="postModal(${post.post_id})" class="btn btn-light rounded ms-1" style="background-color:whitesmoke; border: 1px solid #efa92a;">
                            <i class="fas fa-comments me-1"></i>
                        </button>
                        </div>
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

async function checkUserVoteStatus(postId, userId) {
    console.log(postId);
    console.log(userId);
    try {
        const response = await fetch(`http://localhost:3000/api/v1/community/engage/vote/community_post_fkid = ${postId} AND account_fkid = ${userId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user vote status');
        }

       

        const voteStatus = await response.json();
        console.log(voteStatus.data[0].is_liked);

        if(voteStatus.data[0].is_liked === 1 && voteStatus.data[0].is_disliked === 0){
            return "upvote";
        }

      


        if (voteStatus.data[0].is_liked === 0 && voteStatus.data[0].is_disliked === 0){
            return "none";
        }

        if (voteStatus.data[0].is_liked === 0 && voteStatus.data[0].is_disliked === 1){
            return "downvote";
        }

       
        


        
        

       

    } catch (error) {
        console.error('Error fetching user vote status:', error.message);
        return 'none'; // Return 'none' as default if an error occurs
    }
}




async function postModal(id) {
    try {
        // Retrieve the title modal container
        var titleModalContainer = document.getElementById('titlemodal');
        var contentModalContainer = document.getElementById('contentainer');
        var commentsContainer = document.getElementById('commentsContainer');
        var engageContainer = document.getElementById('engagement');
    
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



        // Check if postData.data is an array and has at least one element
        if (Array.isArray(postData.data) && postData.data.length > 0) {
            const firstPost = postData.data[0]; 

            const userVoteStatus = await checkUserVoteStatus(firstPost.post_id, 1); // Assuming userId is 1
          
        
            let textcolor,likeButtonIcon, likeButtonColor, dislikeButtonIcon, dislikeButtonColor,likeButtonColoricon,dislikeButtonColoricon;

            if (userVoteStatus === 'upvote') {
                console.log("1");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#0e3370';
                textcolor = 'white';
                likeButtonColoricon = '#efa92a';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#efa92a';
                dislikeButtonColoricon = '#0e3370';
            } else if (userVoteStatus === 'downvote') {
                console.log("2");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#efa92a';
                likeButtonColoricon = '#0e3370';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#0e3370';
                dislikeButtonColoricon = '#efa92a';
            } else {
                console.log("3");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#efa92a';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#efa92a';
            }

            // Access the first element
            console.log(firstPost);
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

    
            const imageModalContent = `<img src="${firstPost.image}" class="img-fluid w-100" alt="Full Screen Image">`

            contentstop.innerHTML = imageModalContent;


            const commentModalContent = `<form onsubmit="addComment(${firstPost.post_id}); return false;">
            <div class="d-flex rounded mt-1 align-items-center" style="background-color: whitesmoke;">
             
                    <input type="text" class="round ms-5 form-control" name="" id="commentInput" placeholder="Write a comment..." style="width:80%;">
                    <button class="btn m-3 submit"><i class="fas fa-paper-plane"></i></button>
           
               
            </div>
        </form>`



            commentsContainer.innerHTML = commentModalContent

            const engageContainerContent = `
            <div class="btn-group">
                           <button type="button" style="border-top: 1px solid ${likeButtonColor}; border-left: 1px solid ${likeButtonColor}; border-bottom: 1px solid ${likeButtonColor}; background-color:${likeButtonColor}" class="btn" onclick="upVote(${firstPost.post_id},${firstPost.like_count})" aria-current="page">
                                <i class="${likeButtonIcon} me-1" style="color: ${likeButtonColoricon};"></i>
                                <span style="font-size: 15px; color:${textcolor}">${firstPost.like_count}</span>
                            </button>
                            <button type="button" style="border-top: 1px solid ${dislikeButtonColor}; border-right: 1px solid ${dislikeButtonColor}; border-bottom: 1px solid ${dislikeButtonColor}; background-color:${dislikeButtonColor}" class="btn" onclick="downVote(${firstPost.post_id})">
                                <i class="${dislikeButtonIcon} me-1" style="color:${dislikeButtonColoricon};"></i>
                            </button>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>`

            engageContainer.innerHTML = engageContainerContent







       
        } else {
            console.error('No post data found');
        }

        const response1 = await fetch(`http://localhost:3000/api/v1/community/post/id=${id}`, {
            method: 'GET'
        });

        if (!response1.ok) {
            throw new Error('Failed to fetch post data');
        }

        const postData1 = await response1.json();


        for (const post of postData1.data) {


        }







    } catch (error) {
        console.error('Error fetching post data:', error);
    }
}


async function upVote(id) { 
  
    try {
      
        const existingEngagement = await checkUserVoteStatus(id, 1); // Assuming userId is 1

   
        if (existingEngagement === 'upvote') {
            try {
                const response = await fetch(`http://localhost:3000/api/v1/community/engage/${id}/1`, {
                    method: 'DELETE'
                });
        
                if (response.status === 204) {
                    location.reload(); // Reload the page upon successful deletion
                } else {
                    throw new Error('Failed to delete engagement');
                }
            } catch (error) {
                console.error('Error deleting engagement:', error);
                // Handle the error here (e.g., show an error message to the user)
            }
        }

        else if (existingEngagement === 'downvote'){
           
            const postData = {
                is_liked: 1,
                is_disliked: 0,
            };
                const response = await fetch(`http://localhost:3000/api/v1/community/engage/${id}/1`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                } else {
                location.reload();
                }
            }
            else{
                const postData = {
                    is_liked: 1,
                    is_disliked: 0,
                    community_post_fkid: id,
                    account_fkid: 1,
                    profile_fkid: 1
                };
        
                // Fetch post data
                const response = await fetch(`http://localhost:3000/api/v1/community/engage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                } else {
                    location.reload();
                }
            }

        // If no existing engagement, proceed with upvoting
        
    } catch (error) {
        console.error('Error fetching post data:', error);
    }
}


async function downVote (id) {
    console.log('Downvote button clicked');
    console.log(id);

    try {

        const existingEngagement = await checkUserVoteStatus(id, 1); // Assuming userId is 1

        if (existingEngagement === 'downvote') {

            try {
                const response = await fetch(`http://localhost:3000/api/v1/community/engage/${id}/1`, {
                    method: 'DELETE'
                });
        
                if (response.status === 204) {
                    location.reload(); // Reload the page upon successful deletion
                } else {
                    throw new Error('Failed to delete engagement');
                }
            } catch (error) {
                console.error('Error deleting engagement:', error);
                // Handle the error here (e.g., show an error message to the user)
            }
        }

         else if (existingEngagement === 'upvote'){
            const postData = {
                is_liked: 0,
                is_disliked: 1,
            };
                const response = await fetch(`http://localhost:3000/api/v1/community/engage/${id}/1`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
    
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                } else {
                location.reload();
                }
            }
            else{
                const postData = {
                    is_liked: 0,
                    is_disliked: 1,
                    community_post_fkid: id,
                    account_fkid: 1,
                    profile_fkid: 1
                };
        
                // Fetch post data
                const response = await fetch(`http://localhost:3000/api/v1/community/engage`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                });
        
                if (!response.ok) {
                    throw new Error('Failed to fetch post data');
                } else {
                    location.reload();
                }
            }







    } catch (error) {
        console.error('Error fetching post data:', error);
    }

    
}


async function addComment(id) {
    console.log("lol");
    try {
        const commentText = document.getElementById('commentInput').value; // Assuming you have an input field with id "commentInput"
        const postData = {
            comment: commentText,
            community_post_fkid: id,
            account_fkid: 1,
            profile_fkid: 1
        };

        const response = await fetch('http://localhost:3000/api/v1/community/comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) {
            throw new Error('Failed to add comment');
        }

        location.reload();

        // Optionally, handle success response if needed
    } catch (error) {
        console.error('Error adding comment:', error.message);
        // Optionally, display an error message to the user
    }
}



// PROFILE

async function fetchAccPost(id) {
    var postContainer = document.getElementById('posts');
    try {
        const response = await fetch(`http://localhost:3000/api/v1/community/post/account_fkid=${id}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch post data');
        }

        const postData = await response.json();
        
        postData.data.sort((a, b) => {
            // First, sort by like_count in descending order
            if (b.like_count !== a.like_count) {
                return b.like_count - a.like_count;
            }
            // If like_count is the same, sort by dislike_count in ascending order
            return a.dislike_count - b.dislike_count;
        });

        let postContent = '';

        for (const post of postData.data) {

            const timestamp = new Date(post.timestamp);
            const formattedTimestamp = timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });


            const userVoteStatus = await checkUserVoteStatus(post.post_id, 1); // Assuming userId is 1
          
        
            let textcolor,likeButtonIcon, likeButtonColor, dislikeButtonIcon, dislikeButtonColor,likeButtonColoricon,dislikeButtonColoricon;

            if (userVoteStatus === 'upvote') {
                console.log("1");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#0e3370';
                textcolor = 'white';
                likeButtonColoricon = '#efa92a';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#efa92a';
                dislikeButtonColoricon = '#0e3370';
            } else if (userVoteStatus === 'downvote') {
                console.log("2");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#efa92a';
                likeButtonColoricon = '#0e3370';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#0e3370';
                dislikeButtonColoricon = '#efa92a';
            } else {
                console.log("3");
                likeButtonIcon = 'fas fa-arrow-up';
                likeButtonColor = '#efa92a';
                dislikeButtonIcon = 'fas fa-arrow-down';
                dislikeButtonColor = '#efa92a';
            }

            const currentPostContent = `
                <div class="d-flex mb-4 mt-4 rounded bg-glassy position-relative">
                    <div class="dropdown" style="position: absolute; top: 10px; right: 20px;">
                        <button class="btn btn-light rounded" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-ellipsis-h"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a class="dropdown-item" href="#">Delete</a></li>
                            <li><a class="dropdown-item" href="#">Report</a></li>
                        </ul>
                    </div>
                    <img src="../img/logo2.png" class="me-3 m-4" alt="Bootstrap" width="40" height="40" style="border: 1px solid #efa92a; border-radius: 50%;">
                    <div class="d-flex flex-column">
                        <div class="mt-4 mb-1">
                            <h5 style="margin-bottom: 0; font-size: 16px;">${post.author}</h5>
                            <p style="margin-bottom: 0; font-size:11px;">${formattedTimestamp}</p>
                        </div>


                        <div class="mt-2">
                            <h4>${post.title}</h4>
                        </div>
                          <div id="wow" class="bg-light rounded rounded d-flex align-self-center" data-bs-toggle="modal" data-bs-target="#fullScreenModal" style="max-width: 80%; height: auto; border: 1px solid black; overflow: hidden; margin-right:60px;">
                                <div class="position-relative" style="width: 100%; height: 100%;">
                                    <img src="${post.image}" class="img-fluid" alt="">
                                    <div class="overlay position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white clickable" style="background-color: rgba(0, 0, 0, 0.5); display: none; " onclick="postModal(${post.post_id})">
                                        <span>View Post</span>
                                    </div>
                                </div>
                            </div>
                        <div class="d-flex mt-2 mb-2">
                        <div class="btn-group">
                            <button type="button" style="border-top: 1px solid ${likeButtonColor}; border-left: 1px solid ${likeButtonColor}; border-bottom: 1px solid ${likeButtonColor}; background-color:${likeButtonColor}" class="btn" onclick="upVote(${post.post_id},${post.like_count})" aria-current="page">
                                <i class="${likeButtonIcon} me-1" style="color: ${likeButtonColoricon};"></i>
                                <span style="font-size: 15px; color:${textcolor}">${post.like_count}</span>
                            </button>
                            <button type="button" style="border-top: 1px solid ${dislikeButtonColor}; border-right: 1px solid ${dislikeButtonColor}; border-bottom: 1px solid ${dislikeButtonColor}; background-color:${dislikeButtonColor}" class="btn" onclick="downVote(${post.post_id})">
                                <i class="${dislikeButtonIcon} me-1" style="color:${dislikeButtonColoricon};"></i>
                            </button>
                        </div>
                        <div data-bs-toggle="modal" data-bs-target="#fullScreenModal">
                        <button onclick="postModal(${post.post_id})" class="btn btn-light rounded ms-1" style="background-color:whitesmoke; border: 1px solid #efa92a;">
                            <i class="fas fa-comments me-1"></i>
                        </button>
                        </div>
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






