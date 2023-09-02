const dropContainer = document.getElementById('dropContainer');
const fileInput = document.getElementById('dropzone-file');
const fileList = document.getElementById('fileList');
const showToastButton = document.getElementById('showToastButton');
const toastContainer = document.getElementById('toastContainer');
const maxAllowedSize = 5 * 1024 * 1024; //5mb
const uploadURL = `api/files`;
const emailURL = `api/files/send`;
const toast = (msg)=>{
toastContainer.style.display = 'block';
toastContainer.innerHTML = msg;
setTimeout(function () {
toastContainer.style.display = 'none';
}, 3000);
}


  // document.addEventListener('DOMContentLoaded', function () {
   
  // });
  const onFileUploadSuccess = (res) => {
    fileInput.value = ""; // reset the input
    //status.innerText = "Uploaded";

    // remove the disabled attribute from form btn & make text send
    document.getElementById("copyBtn").removeAttribute("disabled");
    document.getElementById("copyBtn").classList.remove("cursor-not-allowed");
    document.getElementById("sendEmailBtn").removeAttribute("disabled");
    document.getElementById("sendEmailBtn").classList.remove("cursor-not-allowed");
    // hide container
    fileInput.setAttribute("disabled",true);
    dropContainer.style.opacity = 0.5
    document.getElementById("uploadAgainBtn").style.display = 'block'
    

    const { file: url } = JSON.parse(res);
    console.log(url);
    //sharingContainer.style.display = "block";
    document.getElementById("urlInput").value = url
};
dropContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
    //dropContainer.classList.add("dragged");

    // console.log("dropping file");
});

dropContainer.addEventListener("dragleave", (e) => {
  e.preventDefault();  
  //dropContainer.classList.remove("dragged");

    //console.log("drag ended");
});
  const uploadFile = (files) => {
   //const files = fileInput.files;

    const formData = new FormData();
    formData.append("myfile", files[0]);
    //console.log(files[0].filename);
    //show the uploader
    document.getElementById("progressContainer").style.display = "block"
    // pr.style.display = "block";

    // upload file
    const xhr = new XMLHttpRequest();

    // listen for upload progress
    xhr.upload.onprogress = function(event) {
        // find the percentage of uploaded
        const progressNumber = document.getElementById("progressNumber")
        let percent = Math.round((100 * event.loaded) / event.total);
        progressNumber.innerText = `${percent}%`;
         const scaleX = `${percent}%`;
         document.getElementById("progessBar").style.width = scaleX;
        // bar.style.width = scaleX;
        //percent.style.transform = scaleX;
    };

    // handle error
    xhr.upload.onerror = function() {
        toast(`Error in upload: ${xhr.status}.`);
        fileInput.value = ""; // reset the input
        document.getElementById("progressContainer").style.display = "none"
        
    };

    // listen for response which will give the link
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            onFileUploadSuccess(xhr.responseText);
        }
    };

    xhr.open("POST", uploadURL);
    xhr.send(formData);
};

// Handle the drop event when files are dropped into the container
dropContainer.addEventListener('drop', (e) => {
    e.preventDefault();
    dropContainer.classList.remove('highlight');
    
    const files = e.dataTransfer.files;

    // Display the list of dropped files
    fileList.innerHTML = '';
    for (const file of files) {
        const listItem = document.createElement('div');
        listItem.className = 'file-item';
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    }
    if (files[0].size > maxAllowedSize) {
        toast("Max file size is 5MB");
        fileInput.value = ""; // reset the input
        return;
    }
    uploadFile(files);
});

// Handle file selection using the file input
fileInput.addEventListener('change', () => {
    const files = fileInput.files;

    // Display the list of selected files
    fileList.innerHTML = '';
    for (const file of files) {
        const listItem = document.createElement('div');
        listItem.className = 'file-item';
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    }
    if (files[0].size > maxAllowedSize) {
        toast("Max file size is 5MB");
        fileInput.value = ""; // reset the input
        return;
    }
    uploadFile(files);
});
function validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
}
document.getElementById("sendEmailBtn").addEventListener("click", () => {
    //e.preventDefault(); // stop submission
    if(!validateEmail(document.getElementById("emailInput").value))
    {
      toast("Invalid Email")
      return
    }

    const url = document.getElementById("urlInput").value;

    const formData = {
        uuid: url.split("/").splice(-1, 1)[0],
        emailTo: document.getElementById("emailInput").value,
        emailFrom: "mail4trial4@gmail.com",
    };
    //console.log(formData);
    fetch(emailURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                toast("Email Sent");
                document.getElementById("emailInput").value = ""
                //sharingContainer.style.display = "none"; // hide the box
            }
            else{
              toast("Email not sent")
              document.getElementById("emailInput").value = ""

            }
        });
});

document.getElementById("copyBtn").addEventListener('click', () => {
    // Select the text in the input field
    document.getElementById("urlInput").select();

    try {
        // Attempt to copy the selected text to the clipboard
        document.execCommand('copy');
        toast("Copied!")
        //console.log('Text copied to clipboard: ' + document.getElementById("urlInput").value);
    } catch (err) {
        toast('Unable to copy text: ' + err);
    }

    // Deselect the text (optional)
    document.getElementById("urlInput").blur();
});
document.getElementById("uploadAgainBtn").addEventListener('click', () => {
  document.getElementById("copyBtn").setAttribute("disabled",true);
    document.getElementById("copyBtn").classList.add("cursor-not-allowed");
    document.getElementById("sendEmailBtn").setAttribute("disabled",true);
    document.getElementById("sendEmailBtn").classList.add("cursor-not-allowed");
    // hide container
    fileInput.removeAttribute("disabled");
    dropContainer.style.opacity = 1
    document.getElementById("emailInput").value = ""
    document.getElementById("progressContainer").style.display = "none"
    document.getElementById("uploadAgainBtn").style.display = 'none'
    document.getElementById("urlInput").value = ""
});