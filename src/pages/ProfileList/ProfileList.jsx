import { useState, useEffect } from "react";
import axios from "axios";
import useGroups from "../../hooks/useGroups";
import { getTokenFromCookie } from "../../utils/cookies";

const ProfileList = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [groupId, setGroupId] = useState(null);

  const { groups, loading: groupsLoading } = useGroups(API_BASE_URL);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getTokenFromCookie();

      let endpoint = `${API_BASE_URL}/api/users/following`;
      if (groupId) {
        endpoint += `?groupId=${groupId}`;
      }

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [groupId, API_BASE_URL]);

  if (groupsLoading) {
    return <p>Loading groups...</p>;
  }

  return (
    <div>
      <select onChange={(e) => setGroupId(e.target.value)}>
        <option value="">All Users</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>

      <ul>
        {users.length === 0 ? (
          <li>No users available</li>
        ) : (
          users.map((user) => <li key={user.id}>{user.name}</li>)
        )}
      </ul>
    </div>
  );
};

export default ProfileList;
