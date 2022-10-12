import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import Button from "react-bootstrap/Button"
import InputGroup from "react-bootstrap/InputGroup"
import Form from "react-bootstrap/Form"
import Employee from "./components/Employee"
import Table from "react-bootstrap/Table"
import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { useAuthState } from "react-firebase-hooks/auth"

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore"
import { useEffect, useState } from "react"

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE,
    messagingSenderId: process.env.REACT_APP_MESSAGING,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export const auth = getAuth(app)

const App = () => {
    const [user] = useAuthState(auth)

    return <div className='App'>{user ? <Main /> : <SignIn />}</div>
}

const SignIn = () => {
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
    }

    return (
        <section>
            <Button variant='primary' onClick={signInWithGoogle}>
                Sign In With Google
            </Button>
        </section>
    )
}

function Main() {
    const [emps, setEmps] = useState([])

    useEffect(() => {
        getDocsHandler()
    }, [])

    const getDocsHandler = async () => {
        const q = query(
            collection(db, "employees"),
            where("createdBy", "==", auth.currentUser.email)
        )

        await getDocs(q).then((docs) => {
            setEmps(docs.docs)
        })
    }

    const formHandler = async (e) => {
        e.preventDefault()

        const first = document.querySelector("#first").value
        const last = document.querySelector("#last").value
        const email = document.querySelector("#email").value
        const salary = document.querySelector("#salary").value
        const date = document.querySelector("#date").value
        const createdBy = auth.currentUser.email

        await addDoc(collection(db, "employees"), {
            first: first,
            last: last,
            email: email,
            salary: salary,
            date: date,
            createdBy: createdBy,
        })

        getDocsHandler()
        e.target.reset()
    }

    return (
        <>
            <Button variant='outline-primary' onClick={() => auth.signOut()}>
                SignOut
            </Button>
            <Form onSubmit={formHandler}>
                <Form.Group className='mb-3' controlId='first'>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type='name' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='last'>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type='name' required />
                </Form.Group>
                <Form.Group className='mb-3' controlId='email'>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type='email' required />
                </Form.Group>
                <InputGroup className='mb-3'>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control id='salary' type='number' required />
                    <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
                <Form.Group className='mb-3' controlId='date'>
                    <Form.Label>Date</Form.Label>
                    <Form.Control type='date' required />
                </Form.Group>
                <Button variant='primary' type='submit'>
                    Submit
                </Button>
            </Form>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>email</th>
                        <th>salary</th>
                        <th>date</th>
                    </tr>
                </thead>
                <tbody>
                    {emps.map((employee) => (
                        <Employee
                            employee={employee.data()}
                            id={employee.id}
                            key={employee.id}
                            Button={Button}
                            db={db}
                            doc={doc}
                            getDocsHandler={getDocsHandler}
                            deleteDoc={deleteDoc}
                        />
                    ))}
                </tbody>
            </Table>
        </>
    )
}

const employeesData = [
    {
        id: 1,
        firstName: "Susan",
        lastName: "Jordon",
        email: "susan@example.com",
        salary: "95000",
        date: "2019-04-11",
    },
    {
        id: 2,
        firstName: "Adrienne",
        lastName: "Doak",
        email: "adrienne@example.com",
        salary: "80000",
        date: "2019-04-17",
    },
    {
        id: 3,
        firstName: "Rolf",
        lastName: "Hegdal",
        email: "rolf@example.com",
        salary: "79000",
        date: "2019-05-01",
    },
    {
        id: 4,
        firstName: "Kent",
        lastName: "Rosner",
        email: "kent@example.com",
        salary: "56000",
        date: "2019-05-03",
    },
    {
        id: 5,
        firstName: "Arsenio",
        lastName: "Grant",
        email: "arsenio@example.com",
        salary: "65000",
        date: "2019-06-13",
    },
    {
        id: 6,
        firstName: "Laurena",
        lastName: "Lurie",
        email: "laurena@example.com",
        salary: "120000",
        date: "2019-07-30",
    },
    {
        id: 7,
        firstName: "George",
        lastName: "Tallman",
        email: "george@example.com",
        salary: "90000",
        date: "2019-08-15",
    },
    {
        id: 8,
        firstName: "Jesica",
        lastName: "Watlington",
        email: "jesica@example.com",
        salary: "60000",
        date: "2019-10-10",
    },
    {
        id: 9,
        firstName: "Matthew",
        lastName: "Warren",
        email: "matthew@example.com",
        salary: "71000",
        date: "2019-10-15",
    },
    {
        id: 10,
        firstName: "Lyndsey",
        lastName: "Follette",
        email: "lyndsey@example.com",
        salary: "110000",
        date: "2020-01-15",
    },
]

export default App
