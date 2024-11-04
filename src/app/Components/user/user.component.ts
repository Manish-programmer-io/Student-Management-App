import { Component, inject, OnInit } from '@angular/core';
import { UserModel } from '../../Model/user';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {

  private router = inject (Router);
  userList: UserModel[] = [];
  editMode: boolean = false;
  user: UserModel = {
    department: "",
    name: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    city: "",
    salary: 0,
    address: "",
    status: false,
  }
  constructor(private _userService: UserService, private _toastrService: ToastrService) { }
  ngOnInit(): void {
    this.getUserList();
  }
  cityList: string[] = ["Lucknow", "Jaipur", "Kanpur", "Ahemdabad", "Mumbai"];
  departmentList: string[] = ["CSE", "Mechanical", "Electrical", "Electronics", "Management"];

  getUserList() {
    this._userService.getUsers().subscribe((res) => {
      this.userList = res;

    });
  }
  onSubmit(form: NgForm): void {
    debugger;
    if (this.editMode) {
      console.log(form);
      this._userService.updateUser(this.user).subscribe((res) => {
        this.getUserList();
        this.editMode = false;
        form.reset();
        this._toastrService.success('User Updated Successfully', 'Success');

      });
    }
    else {
      console.log(form);
      this._userService.addUser(this.user).subscribe((res) => {
        this.getUserList();
        form.reset();
        this._toastrService.success('User Added Successfully', 'Success');

      });
    }


  }

  onEdit(userdata: UserModel) {
    this.user = userdata;
    this.editMode = true;
  }

  onDelete(id: any) {
    const isConfirm = confirm('Are you sure want to delete this user?');
    if (isConfirm) {
      this._userService.deleteUser(id).subscribe((res) => {
        this._toastrService.error('User deleted successfully', 'Deleted');
        this.getUserList();
      });
    }

  }
  onResetForm(form: NgForm) {
    form.reset();
    this.editMode = false;
    this.getUserList();
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}