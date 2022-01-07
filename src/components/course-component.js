import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  const history = useHistory();
  const handleTakeToLogin = () => {
    history.push("/login");
  };
  let [courseData, setCourseData] = useState(null);

  const handleDeleteCoures = (e) => {
    CourseService.delete(e.target.id)
      .then(() => {
        window.alert("Course has been deleted.");
      })
      .catch((error) => {
        console.log(error.response);
      });
    setCourseData(courseData.filter((course) => course._id != e.target.id));
  };

  const handleDropCourse = (e) => {
    console.log(currentUser.user._id);
    CourseService.dropCourse(e.target.id, currentUser.user._id)
      .then(() => {
        window.alert("Course has been dropped.");
      })
      .catch((error) => {
        console.log(error.response);
      });
    setCourseData(courseData.filter((course) => course._id != e.target.id));
  };

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
      return;
    }

    if (currentUser.user.role == "instructor") {
      CourseService.get(_id)
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.user.role == "student") {
      CourseService.getEnrolledCourses(_id)
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login before seeing your courses.</p>
          <button
            onClick={handleTakeToLogin}
            className="btn btn-primary btn-lg"
          >
            Take me to login page
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Welcome to instructor's Course page.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>Welcome to student's Course page.</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div>
          <p>Here's the data we got back from server.</p>
          <div className="card-container d-flex">
            {courseData.map((course) => (
              <div
                className="card"
                style={{ width: "18rem", marginRight: "1.0rem" }}
              >
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p>Student Count: {course.students.length}</p>

                  {currentUser.user.role == "student" && (
                    <div>
                      <button className="btn btn-primary">
                        $ {course.price}
                      </button>
                      <button
                        onClick={handleDropCourse}
                        id={course._id}
                        className="btn btn-danger ml-2"
                      >
                        退選
                      </button>
                    </div>
                  )}
                  {currentUser.user.role == "instructor" && (
                    <div>
                      <button className="btn btn-primary">
                        $ {course.price}
                      </button>
                      <button className="btn btn-success ml-2">修改</button>
                      <button
                        onClick={handleDeleteCoures}
                        id={course._id}
                        className="btn btn-danger ml-2"
                      >
                        刪除課程
                      </button>
                    </div>
                  )}
                  <br />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
