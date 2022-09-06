import React, { useState, useEffect } from "react";
import listSvg from "./assets/img/list.svg";
import { AddList, Tasks } from "./components";
import axios from "axios";
import { Route, Routes } from "react-router-dom";
import ListLink from "./components/List/ListLink";

function App() {
	const [lists, setLists] = useState([]);
	const [colors, setColors] = useState(null);

	useEffect(() => {
		const allRequests = Promise.all([
			axios
				.get("https://6317872182797be77fff8e46.mockapi.io/lists?_expand=color&_embed=tasks")
				.then(({ data }) => {
					return data;
				}),
			axios.get("https://6317872182797be77fff8e46.mockapi.io/colors/").then(({ data }) => {
				return data;
			}),
			//get tasks
		]);

		allRequests.then((data) => {
			const fetchedLists = data[0];
			const fetchedColors = data[1];
			//data[2]
			const newLists = fetchedLists.map((list) => {
				const targetColor = list.colorId;
				// add tasks to the list by list.id === listId (ne poteryat type)
				return { ...list, colorId: fetchedColors.find((color) => color.id === targetColor)?.hex };
			});
			setLists(newLists);
			setColors(fetchedColors);
			//get tasks
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
			axios.delete("https://6317872182797be77fff8e46.mockapi.io/tasks/" + taskId).catch(() => {
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
			.put("https://6317872182797be77fff8e46.mockapi.io/tasks/" + taskObj.id, {
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
			.put("https://6317872182797be77fff8e46.mockapi.io/tasks/" + taskId, {
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
								// console.log(list.colorId);
								return (
									<ListLink
										to={`/lists/${list.id}`}
										id={list.id}
										key={list.id}
										color={list.colorId}
										isRemovable={true}
										onRemoveList={() => {
											const newLists = lists.filter((item) => item.id !== list?.id);
											setLists(newLists);
										}}
									>
										{list.name}
										{/* {` (${list.tasks.length})`} */}
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
								return (
									<Tasks
										key={list.id}
										list={list}
										onAddTask={onAddTask}
										onEditTitle={onEditListTitle}
										onRemoveTask={onRemoveTask}
										onEditTask={onEditTask}
										onCompleteTask={onCompleteTask}
										withoutEmpty
									/>
								);
							})}
						/>
						<Route
							path="/lists/:id"
							element={
								lists && (
									<Tasks
										lists={lists}
										onAddTask={onAddTask}
										onEditTitle={onEditListTitle}
										onRemoveTask={onRemoveTask}
										onEditTask={onEditTask}
										onCompleteTask={onCompleteTask}
									/>
								)
							}
						/>
					</Routes>
				</div>
			</div>
		</>
	);
}

export default App;
