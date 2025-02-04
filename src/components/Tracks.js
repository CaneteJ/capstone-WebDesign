import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Table, Button, Row, Col } from "react-bootstrap";
import { db } from "../config/firebase";
import { collection, onSnapshot, Timestamp, where, getDocs, query } from "firebase/firestore";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBListGroup, MDBListGroupItem } from "mdb-react-ui-kit";
import UserContext from "../UserContext";
import { MDBBtn, MDBTable } from 'mdb-react-ui-kit';

const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
    transition: "background-color 0.3s ease",
    cursor: "pointer",
    backgroundColor: "#FFFFFF",
    border: "none",
    boxShadow: "none",
};
const customListItemStyle = {
    border: "none", // Remove border from list items
    backgroundColor: "#FFFFFF",
};
const App = () => {
    const { user } = useContext(UserContext); // Initialize user first
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [managementName, setManagementName] = useState(user ? user.managementName : "");
    const [address, setAddress] = useState(user.companyAddress || "");
    const [showAccountingPage, setShowAccountingPage] = useState(false);
    const [showCustomer, setShowCustomer] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [parkingLogs, setParkingLogs] = useState([]);
    const [scheduleData, setScheduleData] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleViewProfile = () => {
        navigate("/Profiles");
    };
    const handlelogin = () => {
        navigate("/");
    };
    const navigate = useNavigate();

    const listItemHoverStyle = {
        backgroundColor: "#003851",
    };
    const handleAgentSchedule = () => {
        navigate("/AgentSchedule");
    };

    const handleRevenues = () => {
        navigate("/Tracks");
    };

    const handleRegister = () => {
        navigate("/AgentRegistration");
    };

    const handleFeed = () => {
        navigate("/Feedback");
    };

    const handleShowAccountingPage = () => {
        setShowAccountingPage(true);
        setShowCustomer(false);
        setShowSchedule(false);
    };

    const handleShowCustomer = () => {
        setShowAccountingPage(false);
        setShowCustomer(true);
        setShowSchedule(false);
    };

    const handleSchedule = () => {
        setShowAccountingPage(false);
        setShowCustomer(false);
        setShowSchedule(true);
    };

    const transactions = [
        { id: 1, date: "2023-08-13", description: "Sale", amount: 500 },
        { id: 2, date: "2023-08-14", description: "Expense", amount: -100 },
    ];

    useEffect(() => {
        const fetchParkingLogs = async () => {
            if (!user || !user.managementName) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const currentUserManagementName = user.managementName;
                const logsCollectionRef = collection(db, "logs");

                const q = query(logsCollectionRef, where("managementName", "==", currentUserManagementName));

                const querySnapshot = await getDocs(q);
                const logs = [];
                querySnapshot.forEach((doc) => {
                    logs.push({ id: doc.id, ...doc.data() });
                });
                setParkingLogs(logs);
            } catch (error) {
                console.error("Error fetching parking logs: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (user && user.managementName) {
            fetchParkingLogs();
        }
    }, [user, db]);

    useEffect(() => {
        const scheduleRef = collection(db, "schedule");

        const unsubscribe = onSnapshot(scheduleRef, (snapshot) => {
            const newData = snapshot.docs.map((doc) => doc.data());
            setScheduleData(newData);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        const scheduleRef = collection(db, "parkingLogs");

        const unsubscribe = onSnapshot(scheduleRef, (snapshot) => {
            const newData = snapshot.docs.map((doc) => doc.data());
            setRevenue(newData);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const styles = {
        welcomeMessage: {
            position: "absolute",
            top: "10px",
            right: "10px",
            margin: "0",
            color: "#fff",
            fontFamily: "Georgina",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
        },
        icon: {
            marginRight: "5px",
        },
    };

    return (
<section>
   
   <div className="admin-dashboard"> {/* Adjusted marginTop to account for navbar */}
       <div className="sidebar">
           <div className="admin-container">
           </div>
           <div class="wrapper">
               <div class="side">
                   <div>
                               {profileImageUrl ? <MDBCardImage src={profileImageUrl} alt="Operator Profile Logo" className="rounded-circle" style={{ width: "70px"}} fluid /> : <MDBCardImage src="default_placeholder.jpg" alt="Default Profile Logo" className="rounded-circle" style={{ width: "70px", marginTop: '-6vh' }} fluid />}
                               <p style={{ fontFamily: "Georgina", fontSize: "20px", border: "white", fontWeight: "bold", colo: 'white'}}>Administrator</p>
                               <p style={{ fontFamily: "Georgina", color: "white", fontWeight: "bold", fontSize: 12, marginTop: -15}}>
                                   {managementName}                 
                               </p>
                               </div>            
                   <h2>Menu</h2>
                   <ul>
                       <li><a href="Dashboard"><i class="fas fa-home"></i>Home</a></li>
                       <li><a href='AgentRegistration'><i class="fas fa-user"></i>Account Management</a></li>
                       <li><a href='Tracks'><i class="fas fa-project-diagram"></i>Management Details</a></li>

                       <li><a href="Profiles"><i class="fas fa-blog"></i>Profile</a></li>
                       <li><a href="Feedback"><i class="fas fa-blog"></i>Feedback</a></li>
                       <li><a href="/"><i className="fas fa-sign-out-alt" style={{ color: 'red' }}></i>Logout</a></li>
                   </ul>

                   
               </div>
               
           </div>
           <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#132B4B', position: "fixed", width: "500vh", marginLeft: '-150vh',height: '15%', marginTop: '-8%'}}>
<div className="container">
   <Link className="navbar-brand" to="/Dashboard" style={{ fontSize: "25px"}}>
   </Link>
</div>
</nav>
</div>


<MDBContainer style={{marginTop: '15vh'}}>
            <h2 style={{fontSize: 50, margin: 'auto'}}>Management Details Page</h2>
            <hr className="divider" style={{Color: '#132B4B'}} />
            <MDBRow className="mb-4 justify-content-center">
                <MDBCol xs={12} md={4} className="mb-4">
                <div className="text-center py-4">
                <img 
                    src="coins.png" 
                    alt="Revenue" 
                    className="img-fluid mb-3" 
                    style={{ height: '90px', borderRadius: '8px' }} />
                <Button 
                    onClick={handleShowAccountingPage} 
                    variant="info" 
                    className="btn-block btn-lg" 
                    style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                    Show Revenue
                </Button>
            </div>
                </MDBCol>
                <MDBCol xs={12} md={4} className="mb-4">
                    <div className="text-center">
                    <div className="text-center py-4">
                    <img src="customer.jpg" alt="Customers" className="img-fluid mb-3" style={{ height: '80px' }} />
                        <Button 
                            onClick={handleShowCustomer}
                            variant="info" 
                            className="btn-block btn-lg" 
                            style={{ boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                            Show Revenue
                        </Button>
                    </div> 
                    </div>
                </MDBCol>
            </MDBRow>
           
            <hr className="divider" />
            {showAccountingPage && (
                <div>
                    <h3 className="text-center mb-4"><i className="fas fa-dollar-sign"></i> Revenue Details</h3>
                    <Table striped bordered hover responsive className="text-center">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>Customer Email</th>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parkingLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.email}</td>
                                    <td>
                                        <p className="text-success">Time in: {log.timeIn && new Date(log.timeIn.seconds * 1000).toLocaleString()}</p>
                                        <p className="text-danger">Time out: {log.timeOut && new Date(log.timeOut.seconds * 1000).toLocaleString()}</p>
                                    </td>
                                    <td>{log.name} - {log.paymentStatus}</td>
                                    <td>{log.user.parkingPay}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {showCustomer && (
                <div>
                    <h3 className="text-center mb-4"><i className="fas fa-users"></i> Customer Details</h3>
                    <Table striped bordered hover responsive className="text-center">
                        <thead className="bg-primary text-white">
                            <tr>
                                <th>Customer Email</th>
                                <th>Name</th>
                                <th>Vehicle</th>
                                <th>Vehicle Plate Number</th>
                                <th>Time in</th>
                                <th>Time out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {parkingLogs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.email}</td>
                                    <td>{log.name}</td>
                                    <td>{log.car}</td>
                                    <td>{log.carPlateNumber}</td>
                                    <td>{new Date(log.timeIn.seconds * 1000).toLocaleString()}</td>
                                    <td>{new Date(log.timeOut.seconds * 1000).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}

            {showSchedule && (
                <div>
                    <h3 className="text-center mb-4"><i className="fas fa-calendar-alt"></i> Agent Schedule Details</h3>
                    <Table striped bordered hover responsive className="text-center">
                        <thead className="bg-success text-white">
                            <tr>
                                <th>Agent Name</th>
                                <th>Email Address</th>
                                <th>Time in</th>
                                <th>Time out</th>
                            </tr>
                        </thead>
                        <tbody>
                            {scheduleData.map((row) => (
                                <tr key={row.id}>
                                    <td>{row.name}</td>
                                    <td>{row.email}</td>
                                    <td>{row.timeIn}</td>
                                    <td>{row.timeOut}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </MDBContainer>
            </div>
        </section>
    );
};

export default App;