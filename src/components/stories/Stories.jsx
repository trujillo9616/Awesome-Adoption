import userData from "./UserData";
import { Link } from "react-router-dom";
import { Form, Row, Button, Modal } from "react-bootstrap";
import UserCard from "../layout/UserCard";
import { useState } from "react";
import { useInsert } from "react-supabase";
import { useAuth } from "../../context/SupaContext";
import { FetchingButton } from "../layout/Buttons/FetchingButton";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import "./Stories.css";
export default function Stories() {
  const [show, setShow] = useState(false);
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState("");
  const { user } = useAuth();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [{ fetching }, execute] = useInsert("stories");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await execute({
      user_id: user.id,
      title: title,
      description: desc,
      region: region,
      country: country,
    });
    if (!error) {
      // insert successfully
      clearInput();
      handleClose();
    } else {
      // display error
      setErr(error.message);
    }
  };

  const clearInput = () => {
    setTitle("");
    setDesc("");
    setCountry("");
    setRegion("");
    setErr("");
  };

  return (
    <div className="stories">
      <div className="main_title">
        <h1>User Story</h1>
        {user ? (
          <Button className="story_btn" onClick={handleShow}>
            Create your Story
          </Button>
        ) : (
          <Button className="story_btn" as={Link} to={"/login"}>
            Login
          </Button>
        )}
      </div>
      <Row className="mb-2 w-100 petList">
        {userData && userData.map((u) => <UserCard key={u.id} userData={u} />)}
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Your Story</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="formContainer">
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="form.title">
                <Form.Label className="str-form-label">Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="form.description">
                <Form.Label className="str-form-label">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={desc}
                  name="desc"
                  onChange={(e) => setDesc(e.target.value)}
                  rows={5}
                  required
                />
              </Form.Group>

              <Form.Group controlId="form.country">
                <Form.Label className="str-form-label">Country</Form.Label>
                <CountryDropdown
                  className="country"
                  name="country"
                  value={country}
                  onChange={(val) => setCountry(val)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="form.region">
                <Form.Label className="str-form-label">Region</Form.Label>
                <RegionDropdown
                  className="region"
                  name="region"
                  blankOptionLabel="No Country Selected"
                  country={country}
                  value={region}
                  onChange={(val) => setRegion(val)}
                  required
                />
              </Form.Group>
              <br />
              <hr />
              <div className="btnContainer">
                <button className="mBtn clearBtn" onClick={clearInput}>
                  Clear
                </button>
                <button className="mBtn closeBtn" onClick={handleClose}>
                  Close
                </button>
                <FetchingButton
                  fetching={fetching}
                  action="Save"
                  type="submit"
                  className="mBtn saveBtn"
                />
              </div>
            </Form>
          </div>
        </Modal.Body>
        {err && (
          <div className="alert alert-danger" role="alert">
            {err}
          </div>
        )}
      </Modal>
    </div>
  );
}
