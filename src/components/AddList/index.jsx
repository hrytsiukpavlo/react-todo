import React, { useState, useEffect } from "react";
import axios from "axios";
import List from "../List";
import addSvg from "../../assets/img/add.svg";
import closeSvg from "../../assets/img/close.svg";
import "./AddList.scss";
import Badge from "../Badge";

const AddList = ({ colors, onAdd }) => {
	const [visiblePopup, setVisiblePopup] = useState(false);
	const [selectedColor, setSelectedColor] = useState(3);
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");

	useEffect(() => {
		if (Array.isArray(colors)) {
			setSelectedColor(colors[0].id);
		}
	}, [colors]);

	const onClose = () => {
		setVisiblePopup(false);
		setInputValue("");
		setSelectedColor(colors[0].id);
	};

	const addList = () => {
		if (!inputValue) {
			alert("Enter list's name");
			return;
		}
		setIsLoading(true);
		axios
			.post("http://localhost:3001/lists", {
				name: inputValue,
				colorId: selectedColor,
			})
			.then(({ data }) => {
				const color = colors.filter((c) => c.id === selectedColor)[0];
				const listObj = { ...data, color, tasks: [] };
				onAdd(listObj);
				onClose();
			})
			.catch(() => {
				alert("Error while adding a list");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="add-list">
			<List
				onClick={() => setVisiblePopup(!visiblePopup)}
				items={[
					{
						className: "list__add-button",
						icon: <img src={addSvg} alt="Add icon" />,
						name: "Add list",
					},
				]}
			/>
			{visiblePopup && (
				<div className="add-list__popup">
					<img onClick={onClose} src={closeSvg} alt="Close icon" className="add-list__popup-close-btn" />
					<input value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="field" type="text" placeholder="List name" />
					<div className="add-list__popup-colors">
						{colors.map((color) => (
							<Badge onClick={() => setSelectedColor(color.id)} key={color.id} color={color.name} className={selectedColor === color.id && "active"} />
						))}
					</div>
					<button onClick={addList} className="button">
						{isLoading ? "Adding..." : "Add"}
					</button>
				</div>
			)}
		</div>
	);
};

export default AddList;