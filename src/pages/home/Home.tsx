import * as React from 'react';


type Props = {};
type State = {};

class Home extends React.Component<Props, State>
{

    public render()
    {
        return(
            <div id="home" style={{marginTop: "100px"}}>
                <div id="header" className="container-fluid text-center">
                    <div className="row">
                        <div className="col-sm-12">
                            <h1 style={{margin: "40px 0", fontWeight: "lighter",color: "rgba(71, 73, 88, 0.93)", textAlign: "center"}}>Home</h1>
                            <hr style={{border: "0px",
                                height: "1px",
                                width: "300px",
                                backgroundColor: "rgba(71, 73, 88, 0.93)"}} />
                        </div>
                    </div>
                </div>
                <div id="info" className="container-fluid text-center">
                    <div className="row">
                        <div className="col-md-12">
                            <h3 style={{textAlign: "center", margin: "40px"}}>Wat is Weather Wars?</h3>
                            <img alt="Weer types" src="https://i1.wp.com/metro.co.uk/wp-content/uploads/2018/02/ios_weather_icons-e1519660727179.png?quality=90&strip=all&zoom=1&resize=644%2C483&ssl=1" style={{height: 322, width: 421, display: "block", marginRight: "auto", marginLeft: "auto"}}></img>
                            <p style={{textAlign: "center", marginLeft: "400px", marginRight: "400px", marginBottom: "40px"}}>Weather Wars is een web-applicatie waar je weddenschappen kan doen op het weer. Gebruikers wedden met Ether op de temperatuur. Je kan kiezen waar, hoelaat en hoeveel de inzet is. Gebruikers kunnen weddenschappen privé of publiekelijk maken. Weatherwars geeft gebruikers ook de optie om weddenschappen met meerdere mensen te spelen.</p>
                            <p style={{textAlign: "center", marginLeft: "400px", marginRight: "400px", marginBottom: "40px"}}>Weatherwars maakt gebruik can de blockchain technologie en zorgt ervoor dat alle gebruikers veilig en snel Ether kunnen gebruiken.</p>
                            
                            <hr style={{border: "0px",
                                height: "1px",
                                width: "300px",
                                backgroundColor: "rgba(71, 73, 88, 0.93)"}} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

 export default Home;