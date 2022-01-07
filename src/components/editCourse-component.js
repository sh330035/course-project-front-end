import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import CourseService from "../services/course.service";

const EditCourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState();
  let [message, setMessage] = useState("");
  const history = useHistory();
  const courseId = useParams().id;

  // method
  const handleTakeToLogin = () => {
    history.push("/login");
  };
  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleChangeDesciption = (e) => {
    setDescription(e.target.value);
  };
  const handleChangePrice = (e) => {
    setPrice(e.target.value);
  };
  const editCourse = () => {
    CourseService.patch(courseId, title, description, price)
      .then(() => {
        window.alert("Course has been edited.");
        history.push("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      });
  };

  useEffect(() => {
    let courseData;

    CourseService.getCourse(courseId)
      .then((res) => {
        courseData = res.data;
        setTitle(courseData.title);
        setDescription(courseData.description);
        setPrice(courseData.price);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before editing a course.</p>
          <button
            className="btn btn-primary btn-lg"
            onClick={handleTakeToLogin}
          >
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role !== "instructor" && (
        <div>
          <p>Only instrcutors can edit courses.</p>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div className="form-group">
          <label for="exampleforTitle">Title</label>
          <input
            name="title"
            type="text"
            className="form-control"
            id="exampleforTitle"
            onChange={handleChangeTitle}
            defaultValue={title}
          />
          <br />
          <label for="exampleforContent">Content</label>
          <textarea
            className="form-control"
            id="exampleforContent"
            aria-describedby="emailHelp"
            name="content"
            onChange={handleChangeDesciption}
            defaultValue={description}
          />
          <br />
          <label for="exampleforPrice">Price</label>
          <input
            name="price"
            type="number"
            className="form-control"
            id="exampleforPrice"
            onChange={handleChangePrice}
            defaultValue={price}
          />
          <br />
          <button className="btn btn-primary" onClick={editCourse}>
            Submit
          </button>
          <br />
          <br />
          {message && (
            <div className="alert alert-warning" role="alert">
              {message}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EditCourseComponent;
