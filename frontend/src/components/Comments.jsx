// Comments section drawn by both Opportunitiy and Job Postings
import React, {useState, useEffect} from 'react';
import {FormGroup, Input, Label, Button, Row, Col} from 'reactstrap';
import { formatDisplayDateTime } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFloppyDisk, faPencil } from '@fortawesome/free-solid-svg-icons'

import Editor from "./Editor"

function Comments({itemComments, onCommentsSave}) {
    const [commentId, setCommentId] = useState(-1);
    const [commentDateTime, setCommentDateTime] = useState('');
    const [commentType, setCommentType] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [theComments, setTheComments] = useState([]);   
    const [showComments, setShowComments] = useState(false);

    // Synchronize `theComments` state with `itemComments` prop
    useEffect(() => {
        if (itemComments) {
            setTheComments(itemComments);
        }
    }, [itemComments]);

    const getCommentIdIndex = (commentId) => {
        // the comment ID is not necessarily the same as the array index
        for (let idIndex = 0; idIndex < theComments.length; idIndex++) {
            if (theComments[idIndex].id === commentId) {
                return idIndex;
            }
        }
        return -1;
    }

    const onCommentChange = (e) => {
        const descCard = document.getElementById("comment_field")
        const ckeContent = descCard.querySelector(".ck-content")
        setCommentContent(ckeContent.ckeditorInstance.getData())
    };

    const onEditButtonClick = (e) => {
        // Load the contents of the particular comment into the edit area
        // if (!e.target.attributes.comment_id.value) console.log("oops")

        var editCommentId = e.target.attributes.comment_id.value;
        setCommentId(editCommentId);
        var thisComment = theComments[editCommentId];

        setCommentDateTime(thisComment.commented_at)
        clearDateGroupError()
        setCommentType(thisComment.comment_type)
        clearTypeGroupError()
        setCommentContent(thisComment.comment_content)

        const commentCard = document.getElementById("comment_field")
        const ckeContent = commentCard.querySelector(".ck-content")
        ckeContent.ckeditorInstance.setData(thisComment.comment_content)
    };

    const onDeleteComment = (e) => {
        var deleteCommentId = e.target.attributes.comment_id.value;
        let updatedComments = theComments;
        let deleteIndex = getCommentIdIndex(deleteCommentId)

        updatedComments.splice(deleteIndex, 1);    
        setTheComments(updatedComments);
        var commentRow = document.querySelector('[comment_row="'+deleteCommentId+'"]');
        commentRow.style.display = "none"   // actual remove can cause problems
    }

    const onCommentSave = () => {
        // console.log("Comments function saving Comment Data")
        // console.log(theComments)
        var validated = true;

        if (commentType === '') {
            // If no type is selected, display error
            var commentTypeGroup = document.getElementById('comment_type_grp')
            commentTypeGroup.classList.add('input-error')
            var commentTypeError = document.getElementById('comment_type_err_msg')
            commentTypeError.style.display = 'block'
            validated = false;
        } else {
            clearTypeGroupError()
        }

        if (commentDateTime === '') {
            // If no DateTime was selected, display error
            var commentDateGroup = document.getElementById('comment_date_grp')
            commentDateGroup.classList.add('input-error')
            var commentDateError = document.getElementById('comment_date_err_msg')
            commentDateError.style.display = 'block'
            validated = false;
        } else {
            clearDateGroupError()
        }

        if (!validated) {
            // if something was not selected, do not save anything
            return
        }

        let comment = {
            "id": commentId, 
            "commented_at": commentDateTime,
            "comment_type": commentType,
            "comment_content": commentContent
        }

        let updatedComments = [];

        if (theComments === undefined || theComments === null || theComments.length === 0) {
            comment.id=0;
            updatedComments.push(comment);
            console.log(updatedComments);
            setTheComments(updatedComments);

        } else if (commentId === -1) {
            comment.id = theComments.length
            updatedComments = theComments
            updatedComments.push(comment)
            setTheComments(updatedComments);
        } else {
            updatedComments = theComments
            updatedComments[commentId] = comment
            setTheComments(updatedComments);
        }

        // Verify that onCommentsSave is indeed a function before calling it
        if (typeof onCommentsSave === 'function') {
            onCommentsSave(updatedComments);  // Call the passed function
        } else {
            console.error("Error: onCommentsSave is not a function");
        }

        // Clear Data in form fields
        setCommentDateTime('');
        setCommentContent('');
        setCommentType('');
        setCommentId(-1);

        const commentCard = document.getElementById("comment_field")
        const ckeContent = commentCard.querySelector(".ck-content")
        ckeContent.ckeditorInstance.setData('')
    }

    const onShowEditComments = (e) => {
        setTheComments(itemComments)
        setShowComments(true)
    }

    const clearDateGroupError = (e) => {
        var commentDateGroup = document.getElementById('comment_date_grp')
        commentDateGroup.classList.remove('input-error')
        var commentDateErrorMsg = document.getElementById('comment_date_err_msg')
        commentDateErrorMsg.style.display = 'none'
    }

    const clearTypeGroupError = (e) => {
        var commentTypeGroup = document.getElementById('comment_type_grp')
        commentTypeGroup.classList.remove('input-error')
        var commentTypeError = document.getElementById('comment_type_err_msg')
        commentTypeError.style.display = 'none'
    }

    const commentCount = ( itemComments !== undefined && itemComments !== null && itemComments.length) ? itemComments.length : 0
    const showCommentsButton = 
            <Button color="success" type="button" onClick={onShowEditComments}>
                Show Comments ({commentCount})</Button>
        
    const editCommentsContent = 
            <Row id="comment_row">
            <Col lg="3" md="4" id="comment_save_col">
                <Button color="primary" type="button" className="mt-4" 
                    onClick={onCommentSave}>
                    <FontAwesomeIcon icon={faFloppyDisk} /> &nbsp; Save Comment</Button>
                
                <br/>
                <FormGroup id="comment_date_grp" className="mt-3">
                    <Label for="commented_at">Comment Date</Label>
                    <Input type="datetime-local"
                        name="commented_at"
                        onChange={(e) => {
                            setCommentDateTime(e.target.value)
                            clearDateGroupError()
                        }}
                        value={commentDateTime ?? ''} />
                    <p id="comment_date_err_msg" style={{display:"none"}}>Select Date & Time</p>
                </FormGroup>
                <FormGroup id="comment_type_grp" >
                    <Label for="comment_type">Comment Type</Label>
                    <Input
                        type="select"
                        name="comment_type"
                        onChange={(e) => {
                            setCommentType(e.target.value)
                            clearTypeGroupError()
                        }}
                        value={commentType ?? ''} >
                            <option value=''></option>
                            <option value="Recruiter emailed Me">Recruiter emailed Me</option>
                            <option value="I e-mailed recruiter">I e-mailed recruiter</option>
                            <option value="Phone Call Notes">Phone Call Notes</option>
                    </Input>
                    <p id="comment_type_err_msg" style={{display:"none"}}>Select Comment Type</p>
                </FormGroup>
            </Col>
            <Col lg="9" md="12" id="comment_field">
                <Row>
                <FormGroup >
                    <Label for="comment_content">Comment</Label>
                    <Editor editorText={commentContent}
                            onEditorChange={onCommentChange} ></Editor>
                </FormGroup>
                </Row>
            </Col>
        </Row>
    
    var commentBlock = '';
    if (theComments !== undefined && theComments !== null && JSON.stringify(theComments) !== '{}' && JSON.stringify(theComments) !== '[]') {
        commentBlock = theComments.map((comment_row) => (
            <Row key={comment_row.id} comment_row={comment_row.id} className="my-3" >
                <hr/>
                <Col md="3">
                    <strong>{ formatDisplayDateTime(comment_row.commented_at)}</strong><br/>
                    <strong>{comment_row.comment_type}</strong><br/>
                    <Button color="success" type="button" 
                        className="m-2 btn-sm" 
                        comment_id={comment_row.id}
                        onClick={onEditButtonClick}>
                         <FontAwesomeIcon icon={faPencil} /> &nbsp; Edit</Button>
                    <Button color="danger" type="button" className="m-1  btn-sm" 
                        comment_id={comment_row.id}
                        onClick={onDeleteComment}>
                        <FontAwesomeIcon icon={faTrash} /> &nbsp; Delete</Button>
                </Col>
                <Col md="9" dangerouslySetInnerHTML={{ __html: comment_row.comment_content }}>
                </Col>
            </Row>
        ));
    }
    
    return (
        <div>
            {showComments ? (
            <>
                {editCommentsContent}
                {commentBlock}
            </>
            ) : (
            showCommentsButton
            )}
        </div>
    )
}

export default Comments;