import React from "react";
import "./List.scss";
import classNames from "classnames";
import removeSvg from "../../assets/img/remove.svg";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import Badge from "../Badge";

const List = ({ items, isRemovable, onClick, onRemove, onClickItem, activeItem }) => {
	const removeList = (item) => {
		if (window.confirm("Are you sure that you want to delete this list?")) {
			onRemove(item);
			axios.delete("https://63184367f6b281877c6769bb.mockapi.io/lists/" + item.id).then(() => {
				onRemove(item.id);
			});
		}
	};

	return (
		<ul onClick={onClick} className="list">
			{items.map((item, index) => (
				<li
					key={uuidv4()}
					className={classNames(item.className, {
						active: item.active ? item.active : activeItem && activeItem.id === item.id,
					})}
					onClick={onClickItem ? () => onClickItem(item) : null}
				>
					<i>{item.icon ? item.icon : <Badge color={item.color.name} />}</i>
					<span>
						{item.name}
						{item.tasks && ` (${item.tasks.length})`}
					</span>
					{isRemovable && (
						<img
							className="list__remove-icon"
							src={removeSvg}
							alt="Remove icon"
							onClick={() => removeList(item)}
						/>
					)}
				</li>
			))}
		</ul>
	);
};

export default List;
