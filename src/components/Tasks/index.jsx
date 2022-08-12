import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import editSvg from "../../assets/img/edit.svg";

import "./Tasks.scss";

import AddTaskForm from "./AddTaskForm";
import Task from "./Task";

const Tasks = ({ lists, list, onEditTitle, onAddTask, onRemoveTask, onEditTask, onCompleteTask, withoutEmpty }) => {
	let { id } = useParams();

	const [activeList, setActiveList] = useState(list);

	useEffect(() => {
		if (id) {
			setActiveList(lists?.find((i) => i.id == id));
		}
	}, [lists, id]);

	const editTitle = () => {
		const newTitle = window.prompt("Название списка", activeList.name);
		if (newTitle) {
			onEditTitle(activeList.id, newTitle);
			axios
				.patch("http://localhost:3001/lists/" + activeList.id, {
					name: newTitle,
				})
				.catch(() => {
					alert("Не удалось обновить название списка");
				});
		}
	};

	return (
		<div className="tasks">
			<Link to={`/lists/${id ? id : list.id}`}>
				<h2 style={{ color: activeList?.color?.hex }} className="tasks__title">
					{activeList?.name}
					<img onClick={editTitle} src={editSvg} alt="Edit icon" />
				</h2>
			</Link>
			<div className="tasks__items">
				{!withoutEmpty && activeList?.tasks && !activeList?.tasks.length && <h2>Задачи отсутствуют</h2>}
				{activeList?.tasks && activeList?.tasks.map((task) => <Task key={task.id} list={activeList} onEdit={onEditTask} onRemove={onRemoveTask} onComplete={onCompleteTask} {...task} />)}
				<AddTaskForm key={id ? id : list.id} id={id ? id : list.id} list={list} onAddTask={onAddTask} />
			</div>
		</div>
	);
};

export default Tasks;
