// Comments section drawn by both Opportunitiy and Job Postings
import React, {useState} from 'react';
import {FormGroup, Input, Label, Button, Container, Row, Col} from 'reactstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faPencil } from '@fortawesome/free-solid-svg-icons'

function Comments({itemComments, onCommentsSave}) {
    const [commentId, setCommentId] = useState(-1);
    const [commentDateTime, setCommentDateTime] = useState('');
    const [commentType, setCommentType] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [theComments, setTheComments] = useState(itemComments);   
    const [showComments, setShowComments] = useState(false);

    const onEditButtonClick = (e) => {
        // Load the contents of the particular comment into the edit area
        var editCommentId = e.target.attributes.comment_id.value;
        setCommentId(editCommentId);
        var thisComment = theComments[editCommentId];

        setCommentDateTime(thisComment.commented_at)
        setCommentType(thisComment.comment_type)
        setCommentContent(thisComment.comment_content)
    };

    const onCommentSave = () => {
        console.log("Comments function saving Comment Data")
        console.log(theComments)
        var validated = true;

        if (commentType == '') {
            // If no type is selected, display error
            var commentTypeGroup = document.getElementById('comment_type_grp')
            commentTypeGroup.classList.add('input-error')
            var commentTypeError = document.getElementById('comment_type_err_msg')
            commentTypeError.style.display = 'block'
            validated = false;
        }

        if (commentDateTime == '') {
            // If no DateTime was selected, display error
            var commentDateGroup = document.getElementById('comment_date_grp')
            commentDateGroup.classList.add('input-error')
            var commentDateError = document.getElementById('comment_date_err_msg')
            commentDateError.style.display = 'block'
            validated = false;
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

        if (theComments.length === 0) {
            comment.id=0;
            updatedComments.push(comment);
            console.log(updatedComments);
            setTheComments(updatedComments);

        } else if (commentId == -1) {
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
        setCommentDateTime('')
        setCommentContent('')
        setCommentType('')
    }

    const onShowEditComments = (e) => {
        setTheComments(itemComments)
        setShowComments(true)
    }

    const showCommentsButton = 
            <Button color="success" type="button" onClick={onShowEditComments}>Show Comments</Button>
        
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
                            var commentDateGroup = document.getElementById('comment_date_grp')
                            commentDateGroup.classList.remove('input-error')
                            var commentTypeError = document.getElementById('comment_date_err_msg')
                            commentTypeError.style.display = 'none'
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
                            var commentTypeGroup = document.getElementById('comment_type_grp')
                            commentTypeGroup.classList.remove('input-error')
                            var commentDateError = document.getElementById('comment_type_err_msg')
                            commentDateError.style.display = 'none'
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
            <Col lg="9" md="12">
                <Row>
                <FormGroup>
                    <Label for="comment_content">Comment</Label>
                    <Input
                        type="textarea" rows="8"
                        name="comment_content"
                        onChange={(e) => setCommentContent(e.target.value)}
                        value={commentContent ?? ''}
                    />
                </FormGroup>
                </Row>
            </Col>
        </Row>
    
    
    return (
        <div>
            {showComments ? editCommentsContent : showCommentsButton}
            <hr/>
            {theComments.map((comment_row) => (
                <Row key={comment_row.id}>
                    <Col md="3">{comment_row.commented_at}<br/>{comment_row.comment_type}<br/>
                        <Button color="success" type="button" 
                            className="m-2" 
                            comment_id={comment_row.id}
                            onClick={onEditButtonClick}>
                             <FontAwesomeIcon icon={faPencil} /> &nbsp; Edit Comment</Button>
                    </Col>
                    <Col md="9">{comment_row.comment_content}
                    </Col>
                    <hr/>
                </Row>
            ))}

        </div>
    )
}

export default Comments;