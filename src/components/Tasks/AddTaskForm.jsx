import React, { useState } from "react";
import addSvg from "../../assets/img/add.svg";
import axios from "axios";

export default function AddTaskForm({ list, onAddTask, id }) {
	const [visibleForm, setVisibleForm] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [isLoading, setIsLoading] = useState("");

	const toggleFormVisible = () => {
		setVisibleForm(!visibleForm);
		setInputValue("");
	};

	const addTask = () => {
		console.log(id);
		const obj = {
			listId: Number(id),
			text: inputValue,
			completed: false,
		};
		setIsLoading(true);
		axios
			.post("https://63184367f6b281877c6769bb.mockapi.io/tasks", obj)
			.then(({ data }) => {
				onAddTask(id, data);
				toggleFormVisible();
			})
			.catch((e) => {
				console.log(e);
				alert("Error while adding a task");
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="tasks__form">
			{!visibleForm ? (
				<div onClick={toggleFormVisible} className="tasks__form-new">
					<img src={addSvg} alt="Add icon" />
					<span>New task</span>
				</div>
			) : (
				<div className="tasks__form-block">
					<input
						value={inputValue}
						className="field"
						type="text"
						placeholder="Task text"
						onChange={(e) => setInputValue(e.target.value)}
					/>
					<button disabled={isLoading} onClick={addTask} className="button">
						{isLoading ? "Adding..." : "Add task"}
					</button>
					<button onClick={toggleFormVisible} className="button button--grey">
						Cancel
					</button>
				</div>
			)}
		</div>
	);
}
