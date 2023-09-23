import { useState, useEffect } from "react";
import axios from "axios";
import useGroups from "../../hooks/useGroups";
import { getTokenFromCookie } from "../../utils/cookies";
import ProfileCard from "../../components/ProfileCard/ProfileCard";

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
        console.log(response);
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
      <select onChange={(e) => setGroupId(Number(e.target.value))}>
        <option value="">All Users</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      {users.length === 0 ? (
        <p>No users available</p>
      ) : (
        users.map((user) => (
          <ProfileCard
            key={user.id}
            profileData={user}
            API_BASE_URL={API_BASE_URL}
          />
        ))
      )}
    </div>
  );
};

export default ProfileList;
