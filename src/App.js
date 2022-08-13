import React, { useState, useEffect } from "react";
import listSvg from "./assets/img/list.svg";
import { List, AddList, Tasks } from "./components";
import axios from "axios";
import { Route, Routes, useNavigate } from "react-router-dom";
import ListLink from "./components/List/ListLink";

function App() {
	const [lists, setLists] = useState([]);
	const [colors, setColors] = useState(null);

	useEffect(() => {
		axios.get("http://localhost:3001/lists?_expand=color&_embed=tasks").then(({ data }) => {
			setLists(data);
		});
		axios.get("http://localhost:3001/colors").then(({ data }) => {
			setColors(data);
		});
	}, []);

	const onAddList = (obj) => {
		const newList = [...lists, obj];
		setLists(newList);
	};

	const onAddTask = (listId, taskObj) => {
		const newList = lists.map((item) => {
			if (item.id == listId) {
				item.tasks = [...item.tasks, taskObj];
			}
			return item;
		});
		setLists(newList);
	};

	const onRemoveTask = (listId, taskId) => {
		if (window.confirm("Are you sure that you want to delete this task?")) {
			const newList = lists.map((item) => {
				if (item.id === listId) {
					item.tasks = item.tasks.filter((task) => task.id !== taskId);
				}
				return item;
			});
			setLists(newList);
			axios.delete("http://localhost:3001/tasks/" + taskId).catch(() => {
				alert("Unable to delete task");
			});
		}
	};

	const onEditTask = (listId, taskObj) => {
		const newTaskText = window.prompt("Task text", taskObj.text);

		if (!newTaskText) {
			return;
		}

		const newList = lists.map((list) => {
			if (list.id === listId) {
				list.tasks = list.tasks.map((task) => {
					if (task.id === taskObj.id) {
						task.text = newTaskText;
					}
					return task;
				});
			}
			return list;
		});
		setLists(newList);
		axios
			.patch("http://localhost:3001/tasks/" + taskObj.id, {
				text: newTaskText,
			})
			.catch(() => {
				alert("Unable to update task");
			});
	};

	const onCompleteTask = (listId, taskId, completed) => {
		const newList = lists.map((list) => {
			if (list.id === listId) {
				list.tasks = list.tasks.map((task) => {
					if (task.id === taskId) {
						task.completed = completed;
					}
					return task;
				});
			}
			return list;
		});
		setLists(newList);
		axios
			.patch("http://localhost:3001/tasks/" + taskId, {
				completed,
			})
			.catch(() => {
				alert("Unable to delete task");
			});
	};

	const onEditListTitle = (id, title) => {
		const newList = lists.map((item) => {
			if (item.id === id) {
				item.name = title;
			}
			return item;
		});
		setLists(newList);
	};
	return (
		<>
			<div className="todo">
				<div className="todo__sidebar">
					<ListLink>
						<div className="list-main">
							<img src={listSvg} alt="List icon" />
							<span>All tasks</span>
						</div>
					</ListLink>
					{lists
						? lists.map((list, index) => {
								return (
									<ListLink
										to={`/lists/${list.id}`}
										id={list.id}
										key={list.id}
										color={list.color?.hex}
										isRemovable={true}
										onRemoveList={() => {
											const newLists = lists.filter((item) => item.id !== list?.id);
											setLists(newLists);
										}}
									>
										{list.name}
										{` (${list.tasks.length})`}
									</ListLink>
								);
						  })
						: "Loading..."}
					<AddList onAdd={onAddList} colors={colors} />
				</div>
				<div className="todo__tasks">
					<Routes>
						<Route
							exact
							path="/"
							element={lists.map((list) => {
								return <Tasks key={list.id} list={list} onAddTask={onAddTask} onEditTitle={onEditListTitle} onRemoveTask={onRemoveTask} onEditTask={onEditTask} onCompleteTask={onCompleteTask} withoutEmpty />;
							})}
						/>
						<Route path="/lists/:id" element={lists && <Tasks lists={lists} onAddTask={onAddTask} onEditTitle={onEditListTitle} onRemoveTask={onRemoveTask} onEditTask={onEditTask} onCompleteTask={onCompleteTask} />} />
					</Routes>
				</div>
			</div>
		</>
	);
}

export default App;
