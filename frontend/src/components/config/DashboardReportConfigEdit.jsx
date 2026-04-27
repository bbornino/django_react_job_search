// frontend/src/components/config/DashboardReportConfigEdit.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Table, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import DeleteConfirmationModal from "../shared/ConfirmationDeleteModal"
import { DASHBOARD_API_URL } from "../../constants";
import { useApiRequest } from "../../utils/useApiRequest";

const DashboardReportConfigEdit = () => {
    const { id } = useParams();
    const [segments, setSegments] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editSegment, setEditSegment] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [segmentToDelete, setSegmentToDelete] = useState(null);
    const hasFetchedSegments = useRef(false);  // Track if the request has already been made
    const { apiRequest } = useApiRequest();
    const [newSegment, setNewSegment] = useState({
        name: "",
        start_date: "",
        end_date: ""
    });

    const url = `${DASHBOARD_API_URL}segments/`;
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    useEffect(() => {
        if (hasFetchedSegments.current) return; // Prevent double fetch
        hasFetchedSegments.current = true;
        const loadSegments = async () => {
            try {
                const response = await apiRequest(url, "GET");
                setSegments(response);
            } catch (err) {
                console.error("Failed to load dashboard report segment.");
            }
        };

        loadSegments();
    }, [apiRequest, url]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSegments((prevSegment) => ({
            ...prevSegment,
            [name]: value,
        }));
    };

    const handleAddSegment = async () => {
        if (isAdding) return; // 🚫 prevent double click

        if (newSegment.name === "" || newSegment.start_date === null) {
            alert("Please fill out all fields before adding a new segment.");
            return;
        }

        try {
            setIsAdding(true);
            const payload = {
                ...newSegment,
                end_date: newSegment.end_date || null
            };

            const createdSegment = await apiRequest(url, payload, { method: "POST" });
            setSegments((prev) => [...prev, createdSegment]);
            setNewSegment({ name: "", start_date: "", end_date: "" }); // Clear form after adding
        } catch (err) {
            console.error("Failed to add dashboard report segment.");
        } finally {
            setIsAdding(false);
        }

        setIsAdding(false);
    };

    const onDeleteSegment = async () => {
        if (!segmentToDelete) return;

        try {
            await apiRequest(`${url}${segmentToDelete.id}`, null, { method: 'DELETE' });
            setSegments(prev => prev.filter(seg => seg.id !== segmentToDelete.id));
            setSegmentToDelete(null);
            toggleDeleteModal();

        } catch (err) {
            console.error("Failed to delete dashboard report segment.");
            alert("Failed to delete segment.");
        }
    };

    const startEdit = (segment) => {
        setEditingId(segment.id);
        setEditSegment({ ...segment });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditSegment(null);
    };

    const saveEdit = async () => {
        if (!editSegment.name || !editSegment.start_date) {
            alert("Name and Start Date are required.");
            return;
        }

        try {
            const payload = { ...editSegment };
            if (!payload.end_date) {
                payload.end_date = null; // Ensure end_date is null if not provided
            }

            const response = await apiRequest(`${url}${editingId}/`, payload, { method: 'PATCH' });
            const updated = response?.data ?? response;

            if (!updated || !updated.id) {
                console.error("Bad PATCH response:", response);
                return;
            }
            setEditingId(null);
            setEditSegment(null);
            setSegments(prev => prev.map(seg => seg.id === updated.id ? updated : seg));
        } catch (err) {
            console.error("Failed to save report segment.");
        }
    };

    return (
        <Container>
            <Card className="text-dark bg-light m-3">
                <CardTitle className="mx-2 my-2"> Edit Dashboard Report </CardTitle>
                <CardBody className="bg-white">
                    <p style={{ marginTop: "-8px", color: "#666" }}>
                        Editing dashboard report segments
                    </p>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {segments.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                                                No segments yet. Add your first one below 👇
                                            </td>
                                        </tr>
                                    ) : (
                                        segments.map((segment) => {
                                            const isEditing = editingId === segment.id;
                                            const edit = editSegment || {};
                                            return (
                                                <tr key={segment.id}>
                                                    <td>{isEditing ? (
                                                        <Input
                                                            type="text"
                                                            onChange={(e) =>
                                                                setEditSegment((prev) => ({ ...prev, name: e.target.value }))
                                                            }
                                                            value={edit.name || ""}
                                                        />
                                                    ) : (
                                                        segment.name
                                                    )}</td>
                                                    <td>{isEditing ? (
                                                        <Input
                                                            type="date"
                                                            onChange={(e) => {
                                                                setEditSegment((prev) => ({ ...prev, start_date: e.target.value }))
                                                            }}
                                                            value={edit.start_date || ""}
                                                        />
                                                    ) : (
                                                        segment.start_date
                                                    )}</td>
                                                    <td>{isEditing ? (
                                                        <Input
                                                            type="date"
                                                            onChange={(e) =>
                                                                setEditSegment((prev) => ({ ...prev, end_date: e.target.value }))
                                                            }
                                                            value={edit.end_date || ""}
                                                        />
                                                    ) : (
                                                        segment.end_date
                                                    )}</td>
                                                    <td>
                                                        {isEditing ? (
                                                            <>
                                                                <Button color="success" size="sm" onClick={saveEdit}>
                                                                    Save
                                                                </Button>{" "}
                                                                <Button color="secondary" size="sm" onClick={cancelEdit}>
                                                                    Cancel
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    color="primary"
                                                                    size="sm"
                                                                    onClick={() => startEdit(segment)}
                                                                >
                                                                    Edit
                                                                </Button>{" "}
                                                                <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSegmentToDelete(segment);
                                                                        toggleDeleteModal();
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        }))
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <Card className="text-dark bg-light m-3">
                <CardTitle className="mx-4 my-2">
                    <Row><Col>Add New Segment</Col></Row> </CardTitle>
                < CardBody className="bg-white">
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="name">Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={newSegment.name}
                                    onChange={(e) => setNewSegment((prev) => ({ ...prev, name: e.target.value }))}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="startDate">Start Date</Label>
                                <Input
                                    type="date"
                                    name="startDate"
                                    value={newSegment.start_date}
                                    onChange={(e) => setNewSegment((prev) => ({ ...prev, start_date: e.target.value }))}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="endDate">End Date</Label>
                                <Input
                                    type="date"
                                    name="endDate"
                                    value={newSegment.end_date}
                                    onChange={(e) => setNewSegment((prev) => ({ ...prev, end_date: e.target.value }))}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={2} className="d-flex align-items-end">
                            <Button color="primary" onClick={handleAddSegment} disabled={isAdding}>
                                Add
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                toggle={toggleDeleteModal}
                onDelete={onDeleteSegment}
            />
        </Container>
    );
}

export default DashboardReportConfigEdit;