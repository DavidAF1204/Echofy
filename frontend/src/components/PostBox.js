import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";

/**
 * Represents a PostBox component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.showPostBox - The bool to determine show or not.
 * @param {Object} props.handlePostClick - The function to handle post click.
 * @returns {React.ReactElement} A PostBox element.
 */
function PostBox({ showPostBox, handlePostClick }) {
  const [postText, setPostText] = useState("");
  const [postImages, setPostImages] = useState([]);
  const fileInputRef = useRef(null);
  const [userID, setUserID] = useState("");

  /**
   * Once the component is loaded, fetch user data by token from backend.
   * Stored the data to  {useState} user id when the request is HTTP-200
   *
   * @api protected
   */
  useEffect(() => {
    const handleAuth = async () => {
      const jwtCookie = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("Echofyjwtsign="));
      if (jwtCookie) {
        try {
          const jwtToken = jwtCookie.split("=")[1];
          const res = await fetch("http://localhost:3001/protected", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ jwtToken }),
          });

          if (res.ok) {
            const { decode } = await res.json();
            setUserID(decode.userId);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };
    handleAuth();
  }, []); // Run this effect only once on component mount

  /**
   * Sending request posting echo data to backend. Clear the data in
   * {useState} post text, post image and file input when the request is HTTP-200
   *
   * @api postEcho
   * @returns null.
   */
  const handlePostSubmit = () => {
    /* Perform post submission logic here,
           write branching function to distinguish between post and repost */
    const content = postText;
    const posterID = userID;

    const imagePromises = postImages.map((image) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result;
          const imageType = image.type;
          resolve({ base64Data, imageType });
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(image);
      });
    });

    Promise.all(imagePromises)
      .then(async (imageDataArray) => {
        // Extract image data and image types
        const base64Images = imageDataArray.map(
          (imageData) => imageData.base64Data
        );
        const imageTypes = imageDataArray.map(
          (imageData) => imageData.imageType
        );

        // Send the data to the API
        const postData = {
          posterID,
          content,
          echoImgList: base64Images,
          echoImgTypes: imageTypes,
        };

        console.log(postData);

        const postEcho = await fetch("http://localhost:3001/postEcho", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });

        if (postEcho.ok) {
          alert("Successfully post an Echo!");
          setPostText("");
          setPostImages([]);
          fileInputRef.current.value = ""; // Clear the file input
          handlePostClick();
          return;
        } else {
          alert("There are some error. Try again");
          return;
        }
      })
      .catch((error) => {
        console.error("Error converting images to base64:", error);
      });
  };

  const handleImageUpload = (event) => {
    const selectedImages = Array.from(event.target.files);
    setPostImages([...postImages, ...selectedImages]);
    fileInputRef.current.value = ""; // Clear the file input
  };

  const handleSelectImagesClick = () => {
    fileInputRef.current.click();
  };

  const removeImage = (index) => {
    const updatedImages = [...postImages];
    updatedImages.splice(index, 1);
    setPostImages(updatedImages);
  };

  return (
    <Modal show={showPostBox} onHide={handlePostClick} centered>
      {/* 
                This is a multi-line comment in JSX. 
                It provides information about the PostBox component. 
                The Modal head contains the post title,
                the modal body contains the from to input post text and post images and
                the modal footer contains the button of post and cancel.
            */}
      <Modal.Header closeButton>
        <Modal.Title>Post an Echo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group controlId="postText">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Express your voice..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="postImages" className="mt-3">
            <Form.Control
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <Button variant="outline-dark" onClick={handleSelectImagesClick}>
              Select Images
            </Button>
          </Form.Group>

          {postImages.length > 0 && (
            <div className="mt-3">
              <h6 className="mb-3">Selected Images:</h6>
              {postImages.map((image, index) => (
                <div key={index} className="mb-2">
                  <span>{image.name}</span>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-3"
                    onClick={() => removeImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="outline-dark" onClick={handlePostClick}>
          Cancel
        </Button>
        <Button variant="outline-danger" onClick={handlePostSubmit}>
          Post
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PostBox;
