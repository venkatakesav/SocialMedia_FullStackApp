import React from "react"
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Button from "../../shared/components/FormElements/Button"
import { useHttpClient } from "../../shared/hooks/http-hook"
import { AuthContext } from "../../shared/context/auth-context"
import { useContext } from "react"
import ErrorModal from "../../shared/components/UIElements/ErrorModal"
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner"
import Modal from "../../shared/components/UIElements/Modal"
import "./PlaceItem.css"
import Card from "../../shared/components/UIElements/Card"

function ReportItem(props) {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext)
  const [showConfirm, showUpdateConfirm] = useState(false);
  const [disable, setDisable] = useState(false);

  const showDeleteWarningHandler = () => {
    showUpdateConfirm(true);
  }

  const CancelDeleteWarningHandler = () => {
    showUpdateConfirm(false);
  }

  const confirmDeleteHandler = async () => {
    console.log("DELETING.......");
    try {
      await sendRequest(`http://localhost:5000/api/places/${props.id}`, 'DELETE', null, {
        Authorization: 'Bearer ' + auth.token

      })
    } catch (err) {
      console.log("Error")
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay></LoadingSpinner>}
          <div className="place-item__image">
            <img src="https://media.istockphoto.com/id/1136409408/photo/close-up-view-of-a-common-octopus.jpg?s=612x612&w=0&k=20&c=PHlT9mhvOOhDf8mMmgOO-FkAf3EbpjpQtZiVFllH5P0=" alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.reported_by}</h2>
            <h3>{props.reported_per}</h3>
            <h3>{props.concern}</h3>
            <h3>{props.post_id}</h3>
          </div>
          <div className="place-item__actions">
            <Button>BLOCK</Button>
            <Button danger>DELETE</Button>
            <Button inverse>IGNORE</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
    // <p>Hello World</p>
  )
}
export default ReportItem