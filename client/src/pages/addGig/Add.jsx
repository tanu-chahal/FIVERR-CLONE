import React, { useReducer, useState } from "react";
import "./Add.scss";
import { INITIAL_STATE, gigReducer } from "../../reducers/gigReducer";
import upload from "../../utils/upload.js";
import newRequest from "../../utils/newRequest.js";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [coverFile, setCoverFile] = useState(undefined);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE);

  const handleChange = (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleFeature = (e) => {
    e.preventDefault();
    dispatch({ type: "ADD_FEATURE", payload: e.target[0].value });
    e.target[0].value = "";
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      const cover = await upload(coverFile);
      const images = await Promise.all(
        [...files].map(async (file) => {
          const url = await upload(file);
          return url;
        })
      );

      setUploading(false);

      dispatch({ type: "ADD_IMAGES", payload: { cover: cover, images } }); //for same name, images:images means same as images
    } catch (err) {
      console.log(err);
    }
  };

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (gig) => {
      return newRequest.post("/gigs", gig);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myGigs"]);
    },
  });

  const handleSubmit = () => {
    mutation.mutate(state);
    navigate("/mygigs");
  };

  return (
    <div className="Add">
      <div className="container">
        <h1>Add New Gig</h1>
        <div className="sections">
          <div className="left">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              onChange={handleChange}
            />

            <label htmlFor="">Category</label>
            <select name="cat" id="cat" onChange={handleChange}>
              <option value="design">Design</option>
              <option value="web">Web Development</option>
              <option value="animation">Animation</option>
              <option value="video">Video Editing</option>
              <option value="music">Music</option>
              <option value="writing">Content Writing</option>
            </select>

            <div className="images">
              <div className="imagesInput">
                <label htmlFor="">Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setCoverFile(e.target.files[0])}
                />

                <label htmlFor="">Upload Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>
              <button onClick={handleUpload}>
                {uploading ? "uploading" : "Upload"}
              </button>
            </div>

            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              cols="30"
              rows="16"
              placeholder="Brief description to introduce your service to customers."
              onChange={handleChange}
            ></textarea>

            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="right">
            <label htmlFor="">Service Title</label>
            <input
              name="shortTitle"
              type="text"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
            />

            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              id=""
              cols="30"
              rows="10"
              placeholder="Short description of your service"
              onChange={handleChange}
            ></textarea>

            <label htmlFor="">Delivery Time(e.g. 3 days)</label>
            <input
              type="number"
              name="deliveryTime"
              onChange={handleChange}
              min={1}
            />

            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
              min={1}
            />

            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">+</button>
            </form>

            <div className="addedFeatures">
              {state?.features?.map((ftr) => {
                return (
                  <div className="item" key={ftr}>
                    <button
                      onClick={() =>
                        dispatch({ type: "REMOVE_FEATURE", payload: ftr })
                      }
                    >
                      {ftr}
                      <span>x</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <label htmlFor="">Price</label>
            <input
              type="number"
              name="price"
              onChange={handleChange}
              min={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
