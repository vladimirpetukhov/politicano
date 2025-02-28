
import { Component, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Comment } from '../../../models/comment.model';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: Comment[] = [];
  selectedComment: Comment | null = null;
  commentForm: Partial<Comment> = {};
  formMode: 'edit' = 'edit';
  
  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
    this.loadComments();
  }
  
  loadComments(): void {
    this.commentService.getAllComments().subscribe(comments => {
      this.comments = comments;
    });
  }
  
  editComment(comment: Comment): void {
    this.formMode = 'edit';
    this.selectedComment = comment;
    this.commentForm = {
      id: comment.id,
      content: comment.content,
      isApproved: comment.isApproved
    };
  }
  
  saveComment(): void {
    if (!this.commentForm.content) return;
    
    this.commentService.updateComment(this.commentForm as Comment).subscribe(() => {
      this.loadComments();
      this.resetForm();
    });
  }
  
  toggleApproval(comment: Comment): void {
    const updatedComment = { ...comment, isApproved: !comment.isApproved };
    this.commentService.updateComment(updatedComment).subscribe(() => {
      this.loadComments();
    });
  }
  
  deleteComment(comment: Comment): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(comment.id).subscribe(() => {
        this.loadComments();
      });
    }
  }
  
  resetForm(): void {
    this.commentForm = {};
    this.selectedComment = null;
  }
}
