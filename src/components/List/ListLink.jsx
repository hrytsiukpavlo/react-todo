import { NavLink, useNavigate } from "react-router-dom";
import cn from "classnames";

import "./ListLink.scss";
import removeSvg from "../../assets/img/remove.svg";
import React from "react";
import axios from "axios";

const ListLink = ({ to, children, color, isRemovable, onRemoveList, id }) => {
	const navigate = useNavigate();
	const removeList = () => {
		if (window.confirm("Are you sure that you want to delete this list?")) {
			axios.delete("http://localhost:3001/lists/" + id).then(() => {
				onRemoveList(id);
				navigate("/");
			});
		}
	};
	return (
		<div>
			<NavLink to={to ? to : "/"} className={({ isActive }) => cn("link", isActive && "active")} end>
				{color ? (
					<span
						className={"color_circle"}
						style={{
							backgroundColor: color,
						}}
					/>
				) : null}
				<div className="list-span">{children}</div>
				{isRemovable ? <img className="list__remove-icon link__remove-icon" src={removeSvg} alt="Remove icon" onClick={removeList} /> : null}
			</NavLink>
		</div>
	);
};

export default ListLink;
