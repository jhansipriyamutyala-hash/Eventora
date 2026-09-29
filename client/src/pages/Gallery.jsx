import { useState } from "react";
import "../styles/Gallery.css";

function Gallery() {
  const events = [
    {
      title: "Hackathon 2026",
      cover:
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900",
      photos: [
        "https://images.unsplash.com/photo-1511578314322-379afb476865?w=900",
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900",
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=900",
        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=900",
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=900",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=900",
        "https://commons.wikimedia.org/wiki/Special:Redirect/file/Wiki_Hackathon_2026_India_-_Coding_Session_-_IMG197.jpg",
      ],
    },

    {
      title: "AI Workshop",
      cover:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900",
      photos: [
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=900",
        "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=900",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900",
        "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=900",
        "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=900",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900",
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=900",
      ],
    },

    {
      title: "Cultural Fest",
      cover:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900",
      photos: [
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900",
        "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=900",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900",
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900",
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=900",
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900",
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=900",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900",
      ],
    },

    {
      title: "Photography Contest",
      cover:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
      photos: [
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=900",
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=900",
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=900",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=900",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900",
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900",
        "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900",
        "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=900",
      ],
    },

    {
      title: "Music Night",
      cover:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900",
      photos: [
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=900",
        "https://images.unsplash.com/photo-1501612780327-45045538702b?w=900",
        "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=900",
        "https://images.unsplash.com/photo-1503095396549-807759245b35?w=900",
        "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=900",
        "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=900",
        "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=900",
      ],
    },

    {
      title: "Dance Competition",
      cover:
        "https://www.iiitkottayam.ac.in/data/images/club/Apoorv%202025_6.jpg",
      photos: [
        "https://www.iiitkottayam.ac.in/data/images/club/Apoorv%202025_6.jpg",
        "https://www.patriciancollege.ac.in/images/Gallery/2025-2026/Culturals/10.jpg",
        "https://tsm.edu.in/assets/student-events/T.S.M-Annaul-Fest/20.jpg",
        "https://christuniversity.in/uploads/userfiles/image/BRC/0V9A7553.JPG",
        "https://www.iimb.ac.in/sites/default/files/inline-images/15_1.jpg",
        "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=900",
        "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=900",
        "https://images.unsplash.com/photo-1547153760-18fc86324498?w=900",
        "https://images.unsplash.com/photo-1535525153412-5a42439a210d?w=900",
      ],
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeEvent = () => {
    setSelectedEvent(null);
  };

  const openImage = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  // NEXT IMAGE
  const nextImage = (e) => {
    e.stopPropagation();

    const nextIndex =
      (selectedImageIndex + 1) % selectedEvent.photos.length;

    setSelectedImageIndex(nextIndex);
    setSelectedImage(selectedEvent.photos[nextIndex]);
  };

  // PREVIOUS IMAGE
  const previousImage = (e) => {
    e.stopPropagation();

    const previousIndex =
      (selectedImageIndex - 1 + selectedEvent.photos.length) %
      selectedEvent.photos.length;

    setSelectedImageIndex(previousIndex);
    setSelectedImage(selectedEvent.photos[previousIndex]);
  };

  return (
    <div className="gallery-page">

      <div className="gallery-header">
        <h1>Event Gallery</h1>

        <p>
          Explore unforgettable memories from EVENTORA.
        </p>
      </div>

      <div className="gallery-container">

        {events.map((event, index) => (
          <div
            className="gallery-card"
            key={index}
            onClick={() => openEvent(event)}
          >
            <img
              src={event.cover}
              alt={event.title}
            />

            <div className="gallery-overlay">
              <h2>{event.title}</h2>
            </div>
          </div>
        ))}

      </div>

      {/* EVENT GALLERY MODAL */}

      {selectedEvent && (
        <div
          className="event-gallery-modal"
          onClick={closeEvent}
        >
          <div
            className="event-gallery-content"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className="event-gallery-close"
              onClick={closeEvent}
            >
              ×
            </button>

            <h2>{selectedEvent.title}</h2>

            <div className="event-gallery-grid">

              {selectedEvent.photos.map((photo, index) => (
                <div
                  className="event-photo-card"
                  key={index}
                  onClick={() => openImage(photo, index)}
                >
                  <img
                    src={photo}
                    alt={`${selectedEvent.title} ${index + 1}`}
                  />
                </div>
              ))}

            </div>

          </div>
        </div>
      )}

      {/* ZOOM IMAGE MODAL */}

      {selectedImage && (
        <div
          className="zoom-image-modal"
          onClick={closeImage}
        >

          {/* CLOSE */}

          <button
            className="zoom-close"
            onClick={closeImage}
          >
            ×
          </button>

          {/* PREVIOUS */}

          <button
            className="zoom-previous"
            onClick={previousImage}
          >
            &lt;
          </button>

          {/* IMAGE */}

          <img
            src={selectedImage}
            alt="Event"
            onClick={(e) => e.stopPropagation()}
          />

          {/* NEXT */}

          <button
            className="zoom-next"
            onClick={nextImage}
          >
            &gt;
          </button>

        </div>
      )}

    </div>
  );
}

export default Gallery;