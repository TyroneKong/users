import React, { FC, useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Input } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
const Form: FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [users, setUsers] = useState([]);
  const [edit, setEdit] = useState(false);
  const [singleUser, setSingleUser] = useState([]);

  const formRef = useRef<HTMLFormElement>(null);

  const DBCall = axios.create({
    baseURL: "http://localhost:8004",
  });

  // get all users
  const getAllUsers = async () => {
    try {
      const response = await DBCall.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [users]);

  //add a user
  const addUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await DBCall.post("/create", {
        name: name,
        age: age,
        country: country,
      });
      console.log(response.data);
      formRef.current?.reset();
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (
    e: React.FormEvent<HTMLFormElement>,
    id: number
  ) => {
    e.preventDefault();
    try {
      const response = await DBCall.put(`/update/${id}`, {
        name: name,
        age: age,
        country: country,
      });
      getAllUsers();
      console.log(response);
      setEdit(false);
    } catch (error) {
      console.log(error);
    }
  };

  //delete a user
  const deleteUser = async (id: number) => {
    try {
      const response = await DBCall.delete(`/delete/${id}`);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  //filter single user by id
  const editButton = (id: number) => {
    setEdit((prevEdit) => (prevEdit ? false : true));
    const single = users.filter((user: any) => user.id === id);
    setSingleUser(single);
  };

  return (
    <div className="flex flex-col items-center">
      <form
        className="flex flex-col items-center w-2/5 gap-2 mb-20"
        ref={formRef}
        onSubmit={addUser}
      >
        <label>name</label>
        <Input
          className="text-center block mt-4 w-64 border rounded px-4 py-2"
          onChange={(e) => setName(e.currentTarget.value)}
          required
        ></Input>
        <label>age</label>
        <Input
          className="text-center block mt-4 w-64 border rounded px-4 py-2"
          onChange={(e) => setAge(e.currentTarget.value)}
          required
        ></Input>

        <label>country</label>
        <Input
          className="text-center block mt-4 w-64 border rounded px-4 py-2"
          onChange={(e) => setCountry(e.currentTarget.value)}
          required
        ></Input>
        <Button variant="contained" type="submit">
          add user
        </Button>
      </form>
      {!edit
        ? users.map((user: any, i) => {
            return (
              <div
                className="text-2xl flex-wrap text-amber-900 gap-10 flex justify-evenly items-center border-black shadow-xl mb-10"
                key={i}
              >
                <>
                  <div className="flex justify-center">{user.name} </div>

                  <div> {user.age}</div>
                  <div>{user.country}</div>
                  <DeleteIcon
                    className="cursor-pointer"
                    onClick={() => deleteUser(user.id)}
                  />
                </>
                <Button onClick={() => editButton(user.id)}>edit</Button>
              </div>
            );
          })
        : //map over single user
          singleUser.map((user: any, i: number) => {
            return (
              <div key={i}>
                <form
                  onSubmit={(e) => updateUser(e, user.id)}
                  className="flex flex-col items-center"
                >
                  <label>name</label>
                  <Input
                    className="text-center block mt-4 w-64 border rounded px-4 py-2"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder={user.name}
                    required
                  ></Input>
                  <label>age</label>
                  <Input
                    className="text-left w-64 border rounded px-4 py-2 "
                    onChange={(e) => setAge(e.currentTarget.value)}
                    required
                  ></Input>
                  <label>Country</label>
                  <Input
                    className="text-center block mt-4 w-64 border rounded px-4 py-2"
                    onChange={(e) => setCountry(e.currentTarget.value)}
                    placeholder={user.country}
                    required
                  ></Input>
                  <div className="flex gap-5 mt-10">
                    <Button type="submit" variant="contained">
                      Update
                    </Button>
                    <Button onClick={() => setEdit(false)} variant="contained">
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            );
          })}
    </div>
  );
};

export default Form;
