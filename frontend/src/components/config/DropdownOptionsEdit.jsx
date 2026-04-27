// frontend/src/components/config/DropdownOptionsEdit.jsx
import React, { useState, useEffect } from "react";
// import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Table, FormGroup, Input, Label, Button, Container, Row, Col, Card, CardTitle, CardBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import DeleteConfirmationModal from "../shared/ConfirmationDeleteModal"
import { DROPDOWN_OPTIONS_API_URL } from "../../constants";
import { useApiRequest } from "../../utils/useApiRequest";


const DropdownOptionsEdit = () => {
    const { name: category } = useParams();
    const { apiRequest } = useApiRequest();
    const [dropdownOptions, setDropdownOptions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editOption, setEditOption] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    // const hasFetchedOptions = useRef(false);  // Track if the request has already been made
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [optionToDelete, setOptionToDelete] = useState(null);
    const [newOption, setNewOption] = useState({
        name: "",
        sort_order: 0,
        is_active: true
    });

    const formatCategory = (str) =>
        str?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const formatCategoryParamToDb = (str) =>
        str?.replace(/-/g, "_");
    const dbCategory = formatCategoryParamToDb(category);
    const url = `${DROPDOWN_OPTIONS_API_URL}?category=${dbCategory}`;
    const toggleDeleteModal = () => setShowDeleteModal(!showDeleteModal);

    // Effect #1: Reset UI state when the category changes
    // --------------------------------------------------
    // This runs immediately on route change.
    // We intentionally DO NOT clear dropdownOptions here,
    // so the previous data remains visible until the new fetch completes.
    // This avoids a jarring "empty table" flicker between navigations.
    //
    // This effect is only responsible for UI state that should not carry over
    // between categories (editing state, form inputs, etc.)
    useEffect(() => {
        setEditingId(null);
        setEditOption(null);
        setNewOption({
            name: "",
            sort_order: 0,
            is_active: true
        });
    }, [category]);

    // Effect #2: Fetch data when the category changes
    // ----------------------------------------------
    // This runs after the category changes and retrieves fresh data.
    // Keeping this separate from the reset logic makes the flow predictable:
    //
    // 1. Category changes
    // 2. UI state resets immediately (above)
    // 3. Data fetch runs and replaces dropdownOptions when complete
    //
    // We allow this to run on every category change instead of blocking it,
    // because preventing re-fetching caused stale data bugs.
    useEffect(() => {
        // if (hasFetchedOptions.current) return; // Prevent double fetch
        // hasFetchedOptions.current = true;
        // Preventing Double Fetch results in the page not updating when changing categories. 
        // So we will allow it to fetch every time the category changes, which is not often.

        const fetchDropdownOptions = async () => {
            if (!category) return;
            const options = await apiRequest(url, { method: 'GET' });
            setDropdownOptions(options);
        };
        fetchDropdownOptions();
    }, [apiRequest, category, url]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewOption(prev => ({ ...prev, [name]: value }));
    };

    const handleAddOption = async () => {
        if (isAdding) return; // 🚫 prevent double click

        if (newOption.name && newOption.sort_order !== 0) {
            try {

                setIsAdding(true);
                const createdOption = await apiRequest(DROPDOWN_OPTIONS_API_URL,
                    { category: dbCategory, ...newOption }, { method: 'POST' });
                setDropdownOptions(prev => [...prev, createdOption]);
                setNewOption({ name: '', sort_order: 0, is_active: true });
            } catch (error) {
                console.error("Error adding option:", error);
                alert("Failed to add option. Please try again.");
            } finally {
                setIsAdding(false);
            }
        } else {
            alert("Please fill in all required fields.");
        }
    };

    const onDeleteDropdownOption = async () => {
        if (!optionToDelete) return;

        try {
            await apiRequest(
                `${DROPDOWN_OPTIONS_API_URL}${optionToDelete.id}/`,
                null, { method: 'DELETE' }
            );

            setDropdownOptions(prev =>
                prev.filter(option => option.id !== optionToDelete.id)
            );
        } catch (error) {
            console.error("Error deleting option:", error);
            alert("Failed to delete option.");
        } finally {
            setOptionToDelete(null);
            toggleDeleteModal();
        }
    };

    const startEdit = (option) => {
        setEditingId(option.id);
        setEditOption({ ...option });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditOption(null);
    };

    const saveEdit = async () => {
        if (editOption.name && editOption.sort_order !== 0) {
            const response = await apiRequest(
                `${DROPDOWN_OPTIONS_API_URL}${editingId}/`,
                editOption,
                { method: 'PATCH' }
            );

            const updated = response?.data ?? response;

            if (!updated || !updated.id) {
                console.error("Bad PATCH response:", response);
                return;
            }

            setDropdownOptions(prev =>
                prev.map(option =>
                    option.id === editingId ? updated : option
                )
            );

            setEditingId(null);
            setEditOption(null);
        }
    };


    return (
        <Container>
            <Card className="text-dark bg-light m-3">
                <CardTitle className="mx-2 my-2">
                    Edit {formatCategory(category)} Dropdown Options
                </CardTitle>
                <CardBody className="bg-white">
                    <p style={{ marginTop: "-8px", color: "#666" }}>
                        Editing dropdown options for <strong>{formatCategory(category)}</strong>
                    </p>
                    <Row>
                        <Col>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Order</th>
                                        <th>Active</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dropdownOptions.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: "center", color: "#888", padding: "20px" }}>
                                                No options yet. Add your first one below 👇
                                            </td>
                                        </tr>
                                    ) : (
                                        dropdownOptions.map(option => {
                                            const isEditing = editingId === option.id;
                                            const edit = editOption || {};

                                            return (
                                                <tr key={option.id}>
                                                    {/* NAME */}
                                                    <td>
                                                        {isEditing ? (
                                                            <Input
                                                                value={edit.name ?? ""}
                                                                onChange={(e) =>
                                                                    setEditOption(prev => ({
                                                                        ...prev,
                                                                        name: e.target.value
                                                                    }))
                                                                }
                                                            />
                                                        ) : (
                                                            option.name
                                                        )}
                                                    </td>

                                                    {/* SORT ORDER */}
                                                    <td>
                                                        {isEditing ? (
                                                            <Input
                                                                type="number"
                                                                value={edit.sort_order ?? 0}
                                                                onChange={(e) =>
                                                                    setEditOption(prev => ({
                                                                        ...prev,
                                                                        sort_order: Number(e.target.value)
                                                                    }))
                                                                }
                                                            />
                                                        ) : (
                                                            option.sort_order
                                                        )}
                                                    </td>

                                                    {/* ACTIVE */}
                                                    <td>
                                                        {isEditing ? (
                                                            <Input
                                                                type="checkbox"
                                                                checked={!!edit.is_active}
                                                                onChange={(e) =>
                                                                    setEditOption(prev => ({
                                                                        ...prev,
                                                                        is_active: e.target.checked
                                                                    }))
                                                                }
                                                            />
                                                        ) : option.is_active ? (
                                                            "Yes"
                                                        ) : (
                                                            "No"
                                                        )}
                                                    </td>

                                                    {/* ACTIONS */}
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
                                                                    onClick={() => startEdit(option)}
                                                                >
                                                                    Edit
                                                                </Button>{" "}
                                                                <Button
                                                                    color="danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setOptionToDelete(option);
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
                                        }))}
                                </tbody>
                            </Table>

                        </Col>
                    </Row>
                </CardBody>
            </Card>


            <Card className="text-dark bg-light m-3">
                <CardTitle className="mx-4 my-2">
                    <Row><Col>Add New Option</Col></Row>
                </CardTitle>

                <CardBody className="bg-white" >
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>Name</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    value={newOption.name}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={2}>
                            <FormGroup>
                                <Label>Order</Label>
                                <Input
                                    type="number"
                                    name="sort_order"
                                    value={newOption.sort_order}
                                    onChange={handleInputChange}
                                />
                            </FormGroup>
                        </Col>
                        <Col md={2} className="d-flex align-items-center">
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        type="checkbox"
                                        name="is_active"
                                        checked={newOption.is_active}
                                        onChange={(e) =>
                                            setNewOption(prev => ({
                                                ...prev,
                                                is_active: e.target.checked
                                            }))
                                        }
                                    /> Active
                                </Label>
                            </FormGroup>
                        </Col>
                        <Col md={2} className="d-flex align-items-center">
                            <Button color="primary" onClick={handleAddOption} disabled={isAdding}>
                                Add
                            </Button>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                toggle={toggleDeleteModal}
                onDelete={onDeleteDropdownOption}
            />
        </Container>
    );
}

export default DropdownOptionsEdit;