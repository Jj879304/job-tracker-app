import {
  useEffect,
  useState,
} from "react";

import "./App.css";

function App() {
  const [job, setJob] =
    useState("");

  const [jobs, setJobs] =
    useState([]);

  useEffect(() => {
    getJobs();
  }, []);

  const getJobs =
    async () => {
      const response =
        await fetch(
          "http://localhost:3001/jobs"
        );

      const data =
        await response.json();

      setJobs(data);
    };

  const addJob =
    async () => {
      if (
        job === ""
      )
        return;

      const newJob = {
        title: job,
        status:
          "Applied",
      };

      const response =
        await fetch(
          "http://localhost:3001/jobs",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              newJob
            ),
          }
        );

      const savedJob =
        await response.json();

      setJobs([
        ...jobs,
        savedJob,
      ]);

      setJob("");
    };

  const deleteJob =
    async (id) => {
      await fetch(
        `http://localhost:3001/jobs/${id}`,
        {
          method:
            "DELETE",
        }
      );

      setJobs(
        jobs.filter(
          (job) =>
            job.id !==
            id
        )
      );
    };

  const changeStatus =
    async (
      id,
      currentStatus
    ) => {
      let newStatus =
        "Applied";

      if (
        currentStatus ===
        "Applied"
      ) {
        newStatus =
          "Interview";
      } else if (
        currentStatus ===
        "Interview"
      ) {
        newStatus =
          "Rejected";
      }

      await fetch(
        `http://localhost:3001/jobs/${id}`,
        {
          method:
            "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(
            {
              status:
                newStatus,
            }
          ),
        }
      );

      getJobs();
    };

  return (
    <div className="app">
      <h1>
        Job Tracker App 🔥
      </h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter company or role..."
          value={job}
          onChange={(e) =>
            setJob(
              e.target
                .value
            )
          }
        />

        <button
          className="add-btn"
          onClick={
            addJob
          }
        >
          Add Job
        </button>
      </div>

      {jobs.map(
        (item) => (
          <div
            className="job-card"
            key={
              item.id
            }
          >
            <div className="job-info">
              {
                item.title
              }{" "}
              -

              <span
                style={{
                  color:
                    item.status ===
                    "Applied"
                      ? "blue"
                      : item.status ===
                        "Interview"
                      ? "orange"
                      : "red",
                }}
              >
                {" "}
                {
                  item.status
                }
              </span>
            </div>

            <div className="button-group">
              <button
                className="status-btn"
                onClick={() =>
                  changeStatus(
                    item.id,
                    item.status
                  )
                }
              >
                Change
                Status
              </button>

              <button
                className="delete-btn"
                onClick={() =>
                  deleteJob(
                    item.id
                  )
                }
              >
                Delete
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}

export default App;