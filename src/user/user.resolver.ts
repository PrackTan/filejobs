// import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
// import { UserService } from "./user.service";
// import { User } from "./schemas/user.schema";
// import { CreateUserDto } from "./dto/create-user.dto";
// import { UpdateUserDto } from "./dto/update-user.dto";

// @Resolver(() => User)
// export class UserResolver {
//     constructor(private userService: UserService) { }

//     @Query(() => [User], { name: "users" })
//     async findAll() {
//         return this.userService.findAll();
//     }

//     @Query(() => User, { name: "user" })
//     async findOne(@Args("id") id: string) {
//         return this.userService.findOne(id);
//     }

//     @Mutation(() => User)
//     async createUser(@Args("input") input: CreateUserDto) {
//         return this.userService.create(input);
//     }

//     @Mutation(() => User)
//     async updateUser(@Args("id") id: string, @Args("input") input: UpdateUserDto) {
//         return this.userService.update(id, input);
//     }

//     @Mutation(() => Boolean)
//     async deleteUser(@Args("id") id: string) {
//         return this.userService.delete(id);
//     }
// }
