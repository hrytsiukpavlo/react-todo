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
			.post("https://phrytsiuk-react-todo.herokuapp.com/tasks", obj)
			.then(({ data }) => {
				onAddTask(id, data);
				toggleFormVisible();
			})
			.catch((e) => {
				console.log(e);
				alert("Ошибка при добавлении задачи");
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
					<span>Новая задача</span>
				</div>
			) : (
				<div className="tasks__form-block">
					<input value={inputValue} className="field" type="text" placeholder="Текст задачи" onChange={(e) => setInputValue(e.target.value)} />
					<button disabled={isLoading} onClick={addTask} className="button">
						{isLoading ? "Добавление..." : "Добавить задачу"}
					</button>
					<button onClick={toggleFormVisible} className="button button--grey">
						Отмена
					</button>
				</div>
			)}
		</div>
	);
}
