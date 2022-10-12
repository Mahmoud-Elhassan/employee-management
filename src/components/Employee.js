const employee = ({
    employee,
    Button,
    id,
    db,
    deleteDoc,
    doc,
    getDocsHandler,
}) => {
    const delEmp = async (id) => {
        await deleteDoc(doc(db, "employees", id))
        getDocsHandler()
    }

    return (
        <tr>
            <td>{employee.first}</td>
            <td>{employee.last}</td>
            <td>{employee.email}</td>
            <td>{employee.salary}</td>
            <td>{employee.date}</td>
            <td>
                <Button variant='outline-secondary' onClick={() => delEmp(id)}>
                    Delete
                </Button>
            </td>
        </tr>
    )
}

export default employee
