import React from "react";
import { Link } from "react-router-dom";

function NavBarVerticalComponent() {
    return (
        <nav className="navbarvertical">
            <ul>
                <li><Link to="#">1</Link></li>
                <li><Link to="#">2</Link></li>
                <li><Link to="#">3</Link></li>
            </ul>
        </nav>
    );
}

export default NavBarVerticalComponent;